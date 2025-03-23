const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("railway.app")
    ? { rejectUnauthorized: false } // Enable SSL if using Railway
    : false,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to Railway PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
