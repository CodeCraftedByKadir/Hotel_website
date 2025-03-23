const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in an 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
  },
});

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at",
      [name, email, hashedPassword, role || "customer"]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { user_id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get all users (Admin only)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const userRole = (
      await pool.query("SELECT role FROM users WHERE id = $1", [
        req.user.user_id,
      ])
    ).rows[0].role;
    if (userRole !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const users = await pool.query("SELECT id, name, email, role FROM users");
    res.json(users.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Update user role
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const userRole = (
      await pool.query("SELECT role FROM users WHERE id = $1", [
        req.user.user_id,
      ])
    ).rows[0].role;
    if (userRole !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const updatedUser = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, id]
    );
    if (updatedUser.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

// Get User Profile
router.get("/profile", authenticateUser, async (req, res) => {
  const userId = req.user.user_id;
  try {
    const user = await pool.query(
      "SELECT id, name, email, phone, profile_picture, role FROM users WHERE id = $1",
      [userId]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Delete user
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const userRole = (
      await pool.query("SELECT role FROM users WHERE id = $1", [
        req.user.user_id,
      ])
    ).rows[0].role;
    if (userRole !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const deletedUser = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );
    if (deletedUser.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

// Update User Profile
router.put(
  "/profile",
  authenticateUser,
  upload.single("profile_picture"),
  [
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("phone")
      .optional()
      .isLength({ min: 7, max: 20 })
      .withMessage("Phone number must be 7-20 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.user_id;
    const { name, email, phone } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      if (email) {
        const emailCheck = await pool.query(
          "SELECT id FROM users WHERE email = $1 AND id != $2",
          [email, userId]
        );
        if (emailCheck.rows.length > 0) {
          return res
            .status(400)
            .json({ message: "Email already in use by another user" });
        }
      }

      const updatedUser = await pool.query(
        `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           profile_picture = COALESCE($4, profile_picture)
       WHERE id = $5
       RETURNING id, name, email, phone, profile_picture, role`,
        [
          name || null,
          email || null,
          phone || null,
          profilePicture || null,
          userId,
        ]
      );

      if (updatedUser.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser.rows[0],
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating profile", error: error.message });
    }
  }
);

// Change Password
router.put("/profile/password", authenticateUser, async (req, res) => {
  const userId = req.user.user_id;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res
      .status(400)
      .json({ message: "Current and new passwords are required" });
  }

  try {
    // Fetch the user’s current password
    const user = await pool.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(
      current_password,
      user.rows[0].password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update the password
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
});

// Get Booking History
router.get("/profile/bookings", authenticateUser, async (req, res) => {
  const userId = req.user.user_id;
  try {
    const bookings = await pool.query(
      `SELECT b.id, b.room_id, b.check_in, b.check_out, b.total_price, b.status, b.created_at, r.name AS room_name
       FROM bookings b
       LEFT JOIN rooms r ON b.room_id = r.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.json(bookings.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
});

router.use("/uploads", express.static("uploads"));

module.exports = router;
