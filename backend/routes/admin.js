const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  router.get("/revenue", async (req, res) => {
    try {
      console.log("Fetching revenue stats...");

      const allBookings = await pool.query(
        "SELECT status, total_price FROM bookings"
      );
      console.log("All bookings:", allBookings.rows);

      const totalEarningsResult = await pool.query(
        "SELECT COALESCE(SUM(total_price), 0) AS total FROM bookings WHERE status IN ('approved', 'confirmed')"
      );
      console.log("Total earnings result:", totalEarningsResult.rows);

      const totalBookingsResult = await pool.query(
        "SELECT COUNT(*) AS total FROM bookings WHERE status IN ('approved', 'confirmed')"
      );
      console.log("Total bookings result:", totalBookingsResult.rows);

      const monthlyRevenueResult = await pool.query(`
        SELECT TO_CHAR(check_in, 'Month') AS month, SUM(total_price) AS revenue
        FROM bookings WHERE status IN ('approved', 'confirmed')
        GROUP BY month ORDER BY MIN(check_in)
      `);
      console.log("Monthly revenue result:", monthlyRevenueResult.rows);

      res.json({
        totalEarnings: parseFloat(totalEarningsResult.rows[0].total) || 0,
        totalBookings: parseInt(totalBookingsResult.rows[0].total, 10) || 0,
        monthlyRevenue: monthlyRevenueResult.rows.map((row) => ({
          month: row.month.trim(),
          revenue: parseFloat(row.revenue) || 0,
        })),
      });
    } catch (err) {
      console.error("Revenue route error:", err.stack);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
