const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Get claimed food history (protected)
router.get('/claimed', auth, async (req, res) => {
  try {
    const [claimedFoods] = await db.query(`
      SELECT 
        cf.id,
        cf.claimed_at,
        f.amount,
        f.dishes,
        f.venue,
        donor.name as donor_name,
        donor.phone as donor_phone,
        claimer.name as claimer_name
      FROM claimed_food cf
      JOIN food f ON cf.food_id = f.id
      JOIN users donor ON cf.donor_id = donor.id
      JOIN users claimer ON cf.claimer_id = claimer.id
      WHERE cf.claimer_id = ?
      ORDER BY cf.claimed_at DESC
    `, [req.user.id]);
    
    res.json(claimedFoods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donated food history (protected)
router.get('/donated', auth, async (req, res) => {
  try {
    const [donatedFoods] = await db.query(`
      SELECT 
        f.id,
        f.amount,
        f.dishes,
        f.venue,
        f.expiry,
        f.claimed_by,
        u.name as claimer_name,
        u.phone as claimer_phone,
        cf.claimed_at
      FROM food f
      LEFT JOIN claimed_food cf ON f.id = cf.food_id
      LEFT JOIN users u ON f.claimed_by = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [req.user.id]);
    
    res.json(donatedFoods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List all available (unclaimed) food
router.get('/', async (req, res) => {
  try {
    const [foods] = await db.query(`
      SELECT f.*, u.name as donor_name
      FROM food f
      JOIN users u ON f.user_id = u.id
      WHERE f.claimed_by IS NULL
    `);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List food (protected)
router.post('/list', auth, async (req, res) => {
  const { amount, dishes, expiry, venue, state, city, custom_city, declaration } = req.body;
  if (!amount || !dishes || !expiry || !venue || !state || (!city && !custom_city) || declaration !== true && declaration !== 1 && declaration !== 'true') {
    return res.status(400).json({ message: 'All fields are required and declaration must be checked' });
  }
  try {
    // Generate food_code
    const [rows] = await db.query("SELECT food_code FROM food WHERE food_code IS NOT NULL ORDER BY id DESC LIMIT 1");
    let nextNum = 1;
    if (rows.length > 0 && rows[0].food_code) {
      nextNum = parseInt(rows[0].food_code.replace('list', '')) + 1;
    }
    const food_code = 'list' + String(nextNum).padStart(5, '0');
    await db.query(
      'INSERT INTO food (food_code, user_id, amount, dishes, expiry, venue, state, city, custom_city, declaration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [food_code, req.user.id, amount, dishes, expiry, venue, state, city, custom_city, declaration ? 1 : 0]
    );
    res.json({ message: 'Food listed successfully', food_code });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim food (protected)
router.post('/claim/:id', auth, async (req, res) => {
  const foodId = req.params.id;
  try {
    console.log('Claiming food ID:', foodId, 'by user ID:', req.user.id);
    // Check if already claimed
    const [foods] = await db.query('SELECT * FROM food WHERE id = ?', [foodId]);
    if (foods.length === 0) return res.status(404).json({ message: 'Food not found' });
    if (foods[0].claimed_by) return res.status(400).json({ message: 'Already claimed' });
    const food = foods[0];
    console.log('Food found:', food);
    // Update food table to mark as claimed
    await db.query('UPDATE food SET claimed_by = ? WHERE id = ?', [req.user.id, foodId]);
    console.log('Food marked as claimed');
    // Generate claim_code
    const [claimRows] = await db.query("SELECT claim_code FROM claimed_food WHERE claim_code IS NOT NULL ORDER BY id DESC LIMIT 1");
    let nextClaimNum = 1;
    if (claimRows.length > 0 && claimRows[0].claim_code) {
      nextClaimNum = parseInt(claimRows[0].claim_code.replace('claim', '')) + 1;
    }
    const claim_code = 'claim' + String(nextClaimNum).padStart(5, '0');
    // Insert record into claimed_food table
    await db.query(
      'INSERT INTO claimed_food (claim_code, food_id, donor_id, claimer_id) VALUES (?, ?, ?, ?)',
      [claim_code, foodId, food.user_id, req.user.id]
    );
    console.log('Record added to claimed_food table');
    res.json({ message: 'Food claimed successfully', claim_code });
  } catch (err) {
    console.error('Error claiming food:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 