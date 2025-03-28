require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const roomRoutes = require("./routes/roomRoutes");
const multer = require("multer"); // Add this
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cron = require("node-cron");
const { sendEmail, sendSMS } = require("./utils/notifications");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "https://suitespot.netlify.app",
  "http://localhost:3000",
  /.+\.netlify\.app$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === "string") return allowed === origin;
        if (allowed instanceof RegExp) return allowed.test(origin);
        return false;
      });
      if (isAllowed) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(bodyParser.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Public callback route
app.get("/api/bookings/callback", async (req, res) => {
  const { bookingId, reference, trxref } = req.query;

  if (!bookingId || !reference || reference !== trxref) {
    return res.status(400).json({ message: "Invalid callback parameters" });
  }

  try {
    const payment = await pool.query(
      "SELECT * FROM payments WHERE transaction_id = $1",
      [reference]
    );
    if (payment.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const verification = await Paystack.transaction.verify({ reference });
    if (verification.data.status !== "success") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    await pool.query(
      "UPDATE payments SET payment_status = 'paid' WHERE transaction_id = $1",
      [reference]
    );
    await pool.query(
      "UPDATE bookings SET status = 'confirmed' WHERE id = $1",
      [bookingId]
    );

    const user = await pool.query(
      "SELECT email, phone FROM users WHERE id = (SELECT user_id FROM bookings WHERE id = $1)",
      [bookingId]
    );
    const { email, phone } = user.rows[0];

    await sendEmail(
      email,
      "Payment Successful",
      `Your payment for booking (ID: ${bookingId}) was successful. Enjoy your stay!`
    );
    if (phone) {
      await sendSMS(
        phone,
        `Payment for booking (ID: ${bookingId}) confirmed. See you soon!`
      );
    }

    await sendEmail(
      process.env.EMAIL_USER,
      "New Payment Received",
      `Payment of $${payment.rows[0].amount} received for booking (ID: ${bookingId}).`
    );

    res.redirect("https://suitespot.netlify.app/my-bookings");
  } catch (error) {
    console.error("Callback error:", error.message);
    res.status(500).json({ message: "Error processing callback" });
  }
});


// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes); // Should mount /payment/verify as /api/payment/verify

console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);

// PostgreSQL Connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for hosted DBs like Railway
  },
});

// Schedule 1-day reminders (runs daily at 9 AM)
cron.schedule("0 9 * * *", async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const bookings = await pool.query(
      "SELECT b.*, u.email, u.phone FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.check_in = $1 AND b.status = 'confirmed'",
      [dateStr]
    );

    for (const booking of bookings.rows) {
      await sendEmail(
        booking.email,
        "Check-In Reminder",
        `Your check-in for booking (ID: ${booking.id}) is tomorrow!`
      );
      if (booking.phone)
        await sendSMS(
          booking.phone,
          `Reminder: Your check-in (ID: ${booking.id}) is tomorrow!`
        );
    }
    console.log("Reminders sent");
  } catch (error) {
    console.error("Cron error:", error.message);
  }
});

app.use("/api/admin", adminRoutes(pool));

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "File upload error", error: err.message });
  }

  console.error("Server error:", err.stack); // Log all errors
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Simple Route
app.get("/", (req, res) => {
  res.send("Luxury Hotel Backend is Running!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
