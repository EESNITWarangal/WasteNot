const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; // Change this in production

// Register
router.post('/register', async (req, res) => {
  const { name, phone, address, password } = req.body;
  if (!name || !phone || !address || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Generate user_code
    const [rows] = await db.query("SELECT user_code FROM users WHERE user_code IS NOT NULL ORDER BY id DESC LIMIT 1");
    let nextNum = 1;
    if (rows.length > 0 && rows[0].user_code) {
      nextNum = parseInt(rows[0].user_code.replace('user', '')) + 1;
    }
    const user_code = 'user' + String(nextNum).padStart(5, '0');
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (user_code, name, phone, address, password) VALUES (?, ?, ?, ?, ?)', [user_code, name, phone, address, hashedPassword]);
    res.json({ message: 'Registration successful', user_code });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, user_code: user.user_code, name: user.name, phone: user.phone, address: user.address } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 