const express = require("express");
const pool = require("../config/db");
const { authenticateUser } = require("../middleware/authMiddleware");
const { sendEmail, sendSMS } = require("../utils/notifications");
const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

const router = express.Router();

// Create a new booking request
router.post("/", authenticateUser, async (req, res) => {
  const { room_id, check_in, check_out } = req.body;
  const userId = req.user.user_id;

  try {
    const room = await pool.query(
      "SELECT price FROM rooms WHERE id = $1 AND is_available = TRUE",
      [room_id]
    );
    if (room.rows.length === 0)
      return res.status(404).json({ message: "Room not found or unavailable" });

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0)
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    const total_price = room.rows[0].price * nights;

    const user = await pool.query(
      "SELECT email, phone FROM users WHERE id = $1",
      [userId]
    );
    const { email, phone } = user.rows[0];

    const newBooking = await pool.query(
      "INSERT INTO bookings (room_id, user_id, check_in, check_out, total_price, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *",
      [room_id, userId, check_in, check_out, total_price]
    );
    const booking = newBooking.rows[0];

    await sendEmail(
      email,
      "Booking Request Received",
      `Your booking request for Room ${room_id} from ${check_in} to ${check_out} is pending approval. Total: $${total_price}`
    );
    if (phone)
      await sendSMS(
        phone,
        `Booking request for Room ${room_id} pending. Total: $${total_price}`
      );

    await sendEmail(
      process.env.EMAIL_USER,
      "New Booking Request",
      `User ${userId} requested Room ${room_id} from ${check_in} to ${check_out}. Total: $${total_price}`
    );

    res.status(201).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
});

// Replace the existing GET /bookings route
router.get("/", authenticateUser, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const bookings = await pool.query(
      `SELECT bookings.id, 
              COALESCE(rooms.name, 'Unknown Room') AS "roomName", 
              bookings.check_in AS "checkIn", 
              bookings.check_out AS "checkOut", 
              bookings.total_price AS "totalPrice", 
              bookings.status 
       FROM bookings 
       LEFT JOIN rooms ON bookings.room_id = rooms.id 
       WHERE bookings.user_id = $1 
       ORDER BY bookings.id DESC`,
      [userId]
    );
    res.json(bookings.rows);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch a single booking
router.get("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const booking = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (booking.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
});

// Update booking status (alternative route)
router.put("/:id/status", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const userRole = (
      await pool.query("SELECT role FROM users WHERE id = $1", [
        req.user.user_id,
      ])
    ).rows[0].role;
    if (userRole !== "admin" && userRole !== "staff") {
      return res.status(403).json({ message: "Admin or staff only" });
    }

    const booking = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (booking.rows.length === 0)
      return res.status(404).json({ message: "Booking not found" });

    const user = await pool.query(
      "SELECT email, phone FROM users WHERE id = $1",
      [booking.rows[0].user_id]
    );
    const { email, phone } = user.rows[0];

    await sendEmail(
      email,
      `Booking ${status}`,
      `Your booking (ID: ${id}) has been ${status}.`
    );
    if (phone)
      await sendSMS(phone, `Your booking (ID: ${id}) has been ${status}.`);

    res.json(booking.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking status", error: error.message });
  }
});

// Initiate Payment with Paystack and Verify on Callback
router.post("/:id/pay", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const booking = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2 AND status = 'approved'",
      [id, userId]
    );
    if (booking.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Booking not found or not approved" });

    const user = await pool.query("SELECT email FROM users WHERE id = $1", [
      userId,
    ]);
    const { email } = user.rows[0];
    const amountInKobo = Math.round(booking.rows[0].total_price * 100); // Paystack uses kobo (cents)

    const payment = await Paystack.transaction.initialize({
      email,
      amount: amountInKobo,
      callback_url: `https://hotelwebsite-production-ddb7.up.railway.app/api/payments/callback?bookingId=${id}`, // Pass bookingId in callback
      metadata: { booking_id: id },
    });

    // Store initial payment details
    await pool.query(
      "INSERT INTO payments (user_id, amount, payment_status, transaction_id) VALUES ($1, $2, 'pending', $3) RETURNING *",
      [userId, booking.rows[0].total_price, payment.data.reference]
    );

    res.json({
      payment_url: payment.data.authorization_url,
      reference: payment.data.reference,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error initiating payment", error: error.message });
  }
});

// Approve/Reject Booking (Admin only)
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const userRole = (
      await pool.query("SELECT role FROM users WHERE id = $1", [
        req.user.user_id,
      ])
    ).rows[0].role;
    if (userRole !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const booking = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (booking.rows.length === 0)
      return res.status(404).json({ message: "Booking not found" });

    const user = await pool.query(
      "SELECT email, phone FROM users WHERE id = $1",
      [booking.rows[0].user_id]
    );
    const { email, phone } = user.rows[0];

    await sendEmail(
      email,
      `Booking ${status}`,
      `Your booking (ID: ${id}) has been ${status}.`
    );
    if (phone)
      await sendSMS(phone, `Your booking (ID: ${id}) has been ${status}.`);

    res.json(booking.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
});

// Verify Payment after Callback
router.post("/:id/verify-payment", authenticateUser, async (req, res) => {
  const { id } = req.params; // bookingId
  const { reference } = req.body;
  const userId = req.user.user_id;

  try {
    const booking = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (booking.rows.length === 0)
      return res.status(404).json({ message: "Booking not found" });

    const verification = await Paystack.transaction.verify({ reference });
    if (verification.data.status !== "success") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const payment = await pool.query(
      "SELECT * FROM payments WHERE transaction_id = $1",
      [reference]
    );
    if (payment.rows.length === 0)
      return res.status(404).json({ message: "Payment not found" });

    await pool.query(
      "UPDATE payments SET payment_status = 'paid' WHERE transaction_id = $1",
      [reference]
    );
    await pool.query("UPDATE bookings SET status = 'confirmed' WHERE id = $1", [
      id,
    ]);

    const user = await pool.query(
      "SELECT email, phone FROM users WHERE id = $1",
      [userId]
    );
    const { email, phone } = user.rows[0];

    await sendEmail(
      email,
      "Payment Successful",
      `Your payment for booking (ID: ${id}) was successful. Enjoy your stay!`
    );
    if (phone)
      await sendSMS(
        phone,
        `Payment for booking (ID: ${id}) confirmed. See you soon!`
      );

    await sendEmail(
      process.env.EMAIL_USER,
      "New Payment Received",
      `Payment of $${payment.rows[0].amount} received for booking (ID: ${id}).`
    );

    res.status(200).json({ message: "Payment verified" });
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
});

module.exports = router;
