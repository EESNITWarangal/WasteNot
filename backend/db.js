const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Prodeep#sql2255',
  database: process.env.DB_NAME || 'wastenot',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Solution: Update the password in db.js file');
      console.log('   - You set a MySQL root password during installation');
      console.log('   - Change the password field in db.js to your actual password');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Solution: Database "wastenot" does not exist');
      console.log('   - Create the database first');
    }
  } else {
    console.log('✅ Database connected successfully!');
    connection.release();
  }
});

module.exports = pool.promise(); 