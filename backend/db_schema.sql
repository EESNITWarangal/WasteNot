-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_code VARCHAR(20) UNIQUE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Food table
CREATE TABLE IF NOT EXISTS food (
  id INT AUTO_INCREMENT PRIMARY KEY,
  food_code VARCHAR(20) UNIQUE,
  user_id INT NOT NULL,
  amount VARCHAR(100) NOT NULL,
  dishes VARCHAR(255) NOT NULL,
  expiry DATE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  custom_city VARCHAR(100),
  declaration TINYINT(1) DEFAULT 0,
  claimed_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (claimed_by) REFERENCES users(id)
); 

-- Claimed food table
CREATE TABLE IF NOT EXISTS claimed_food (
    id INT AUTO_INCREMENT PRIMARY KEY,
    claim_code VARCHAR(20) UNIQUE,
    food_id INT NOT NULL,
    donor_id INT NOT NULL,
    claimer_id INT NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES food(id),
    FOREIGN KEY (donor_id) REFERENCES users(id),
    FOREIGN KEY (claimer_id) REFERENCES users(id)
);