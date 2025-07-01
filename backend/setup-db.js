const mysql = require('mysql2');

// First connect without specifying database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Prodeep#sql2255', // Update this if you have a password
});

async function setupDatabase() {
  try {
    console.log('Connecting to MySQL...');
    
    // Create database if it doesn't exist
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS wastenot');
    console.log('✅ Database "wastenot" created/verified');
    
    // Use the database
    await connection.promise().query('USE wastenot');
    
    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        address VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS food (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount VARCHAR(100) NOT NULL,
        dishes VARCHAR(255) NOT NULL,
        expiry DATE NOT NULL,
        venue VARCHAR(255) NOT NULL,
        claimed_by INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (claimed_by) REFERENCES users(id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS claimed_food (
        id INT AUTO_INCREMENT PRIMARY KEY,
        food_id INT NOT NULL,
        donor_id INT NOT NULL,
        claimer_id INT NOT NULL,
        claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (food_id) REFERENCES food(id),
        FOREIGN KEY (donor_id) REFERENCES users(id),
        FOREIGN KEY (claimer_id) REFERENCES users(id)
      )`
    ];
    
    for (const table of tables) {
      await connection.promise().query(table);
    }
    
    console.log('✅ All tables created successfully!');
    console.log('✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 You need to set your MySQL root password:');
      console.log('1. Open backend/db.js');
      console.log('2. Change password: "" to password: "your_actual_password"');
      console.log('3. Also update backend/setup-db.js with the same password');
      console.log('4. Run this script again');
    }
  } finally {
    connection.end();
  }
}

setupDatabase(); 