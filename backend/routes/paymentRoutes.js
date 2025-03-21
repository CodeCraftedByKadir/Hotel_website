const express = require("express");
const pool = require("../config/db");
const { sendEmail, sendSMS } = require("../utils/notifications");
const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

const router = express.Router();

// Payment Callback (Verify Payment)
router.get("/payment/verify", async (req, res) => {
  const { reference } = req.query;

  try {
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

    const bookingId = verification.data.metadata.booking_id;
    await pool.query(
      "UPDATE payments SET payment_status = 'paid' WHERE transaction_id = $1",
      [reference]
    );
    await pool.query("UPDATE bookings SET status = 'confirmed' WHERE id = $1", [
      bookingId,
    ]);

    const user = await pool.query(
      "SELECT email, phone FROM users WHERE id = $1",
      [payment.rows[0].user_id]
    );
    const { email, phone } = user.rows[0];

    await sendEmail(
      email,
      "Payment Successful",
      `Your payment for booking (ID: ${bookingId}) was successful. Enjoy your stay!`
    );
    if (phone)
      await sendSMS(
        phone,
        `Payment for booking (ID: ${bookingId}) confirmed. See you soon!`
      );

    await sendEmail(
      process.env.EMAIL_USER,
      "New Payment Received",
      `Payment of $${payment.rows[0].amount} received for booking (ID: ${bookingId}).`
    );

    res.status(200).json({
      message: "Payment verified successfully",
      bookingId,
      redirectTo: "/profile",
    });
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
});

module.exports = router;
