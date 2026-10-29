const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection (PostgreSQL - compatible with free tiers on Neon, Supabase, or Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/smm_db",
  ssl: { rejectUnauthorized: false }
});

// Wholesale Supplier Configuration (e.g., SMMWIZ / JAP)
const SUPPLIER_API_URL = "https://smmwiz.com/api/v2";
const SUPPLIER_API_KEY = process.env.SUPPLIER_API_KEY || "your_supplier_api_key_here";

// 1. Get All Services Endpoint
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Place Order & Route to Wholesale Supplier API
app.post('/api/order', async (req, res) => {
  const { userId, serviceId, link, quantity, rateUSD } = req.body;
  const totalCostUSD = (rateUSD * (quantity / 1000)).toFixed(2);

  try {
    // Check user balance
    const userRes = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: "User not found" });
    
    const currentBalance = parseFloat(userRes.rows[0].balance);
    if (currentBalance < totalCostUSD) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    // Forward order to wholesale supplier API
    const supplierRes = await axios.post(SUPPLIER_API_URL, {
      key: SUPPLIER_API_KEY,
      action: 'add',
      service: serviceId,
      link: link,
      quantity: quantity
    });

    if (supplierRes.data.error) {
      return res.status(400).json({ error: `Supplier Error: ${supplierRes.data.error}` });
    }

    const supplierOrderId = supplierRes.data.order;

    // Deduct balance and record order in database
    await pool.query('BEGIN');
    await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [totalCostUSD, userId]);
    const orderInsert = await pool.query(
      'INSERT INTO orders (user_id, service_id, link, quantity, charge, supplier_order_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, serviceId, link, quantity, totalCostUSD, supplierOrderId, 'Processing']
    );
    await pool.query('COMMIT');

    res.json({ success: true, order: orderInsert.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

// 3. User Deposit Endpoint (Manual UPI / Crypto Verification)
app.post('/api/deposit', async (req, res) => {
  const { userId, amountUSD, referenceId } = req.body;
  try {
    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amountUSD, userId]);
    await pool.query(
      'INSERT INTO transactions (user_id, amount, reference_id, status) VALUES ($1, $2, $3, $4)',
      [userId, amountUSD, referenceId, 'Completed']
    );
    res.json({ success: true, message: "Funds successfully added to wallet!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Full-Stack SMM Server running on port ${PORT}`));
