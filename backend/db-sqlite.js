const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the backend directory
const dbPath = path.join(__dirname, 'wastenot.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    password TEXT NOT NULL
  )`);

  // Food table
  db.run(`CREATE TABLE IF NOT EXISTS food (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount TEXT NOT NULL,
    dishes TEXT NOT NULL,
    expiry TEXT NOT NULL,
    venue TEXT NOT NULL,
    claimed_by INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (claimed_by) REFERENCES users(id)
  )`);

  // Claimed food table
  db.run(`CREATE TABLE IF NOT EXISTS claimed_food (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    food_id INTEGER NOT NULL,
    donor_id INTEGER NOT NULL,
    claimer_id INTEGER NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES food(id),
    FOREIGN KEY (donor_id) REFERENCES users(id),
    FOREIGN KEY (claimer_id) REFERENCES users(id)
  )`);
});

// Promise wrapper for SQLite
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve([rows]);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ insertId: this.lastID });
    });
  });
}

module.exports = { query, run, db }; 