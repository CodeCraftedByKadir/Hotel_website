const express = require("express");
const pool = require("../config/db");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await pool.query("SELECT * FROM rooms");
    res.json(rooms.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
});

// Delete a room (Admin only)
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

    const deletedRoom = await pool.query(
      "DELETE FROM rooms WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedRoom.rows.length === 0)
      return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting room", error: error.message });
  }
});

module.exports = router;
