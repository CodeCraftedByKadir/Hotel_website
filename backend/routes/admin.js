const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
require("dotenv").config();

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Revenue Route
router.get("/revenue", async (req, res) => {
  try {
    const totalEarningsResult = await pool.query(
      "SELECT COALESCE(SUM(total_price), 0) AS total FROM bookings WHERE status = 'approved'"
    );
    const totalBookingsResult = await pool.query(
      "SELECT COUNT(*) AS total FROM bookings WHERE status = 'approved'"
    );
    const monthlyRevenueResult = await pool.query(`
      SELECT TO_CHAR(created_at, 'Month') AS month, SUM(total_price) AS revenue
      FROM bookings WHERE status = 'approved'
      GROUP BY month ORDER BY MIN(created_at)
    `);

    res.json({
      totalEarnings: totalEarningsResult.rows[0].total || 0,
      totalBookings: totalBookingsResult.rows[0].total || 0,
      monthlyRevenue: monthlyRevenueResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
