const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Prodeep#sql2255',
  database: 'wastenot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkDatabase() {
  try {
    console.log('=== Checking Database ===');
    
    // Check users table
    const [users] = await pool.promise().query('SELECT id, name, phone FROM users');
    console.log('\nUsers:', users);
    
    // Check food table
    const [food] = await pool.promise().query('SELECT * FROM food');
    console.log('\nFood:', food);
    
    // Check claimed_food table
    const [claimedFood] = await pool.promise().query('SELECT * FROM claimed_food');
    console.log('\nClaimed Food:', claimedFood);
    
    // Check if user 1 has claimed any food
    const [userClaims] = await pool.promise().query(`
      SELECT 
        cf.id,
        cf.claimed_at,
        f.amount,
        f.dishes,
        f.venue,
        donor.name as donor_name,
        claimer.name as claimer_name
      FROM claimed_food cf
      JOIN food f ON cf.food_id = f.id
      JOIN users donor ON cf.donor_id = donor.id
      JOIN users claimer ON cf.claimer_id = claimer.id
      WHERE cf.claimer_id = 1
    `);
    console.log('\nUser 1 Claims:', userClaims);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
}

checkDatabase(); 