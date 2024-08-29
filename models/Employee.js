const { Pool } = require('pg');
const pool = new Pool();

const createEmployeeTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      position VARCHAR(50) NOT NULL,
      department VARCHAR(50) NOT NULL,
      date_of_joining DATE NOT NULL,
      profile_picture VARCHAR(255)
    );
  `);
};

createEmployeeTable();
