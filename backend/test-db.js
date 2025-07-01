const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Set your MySQL root password if you have one
  database: 'wastenot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    
    // Test if database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE "wastenot"');
    if (databases.length === 0) {
      console.log('❌ Database "wastenot" does not exist');
      console.log('Creating database...');
      await connection.query('CREATE DATABASE wastenot');
      console.log('✅ Database "wastenot" created');
    } else {
      console.log('✅ Database "wastenot" exists');
    }
    
    // Use the database
    await connection.query('USE wastenot');
    
    // Test if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));
    
    connection.release();
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Make sure MySQL is running');
      console.log('   - If using XAMPP: Start MySQL from XAMPP Control Panel');
      console.log('   - If using MySQL Installer: Check MySQL service is running');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Solution: Check your MySQL username/password');
      console.log('   - Current config: user=root, password=empty');
      console.log('   - Update db.js if you set a different password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Solution: Database "wastenot" does not exist');
      console.log('   - Run the schema commands to create it');
    }
  }
}

testConnection(); 