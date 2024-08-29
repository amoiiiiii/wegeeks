const { Pool } = require('pg');
const pool = new Pool();

const createAbsenceTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS absences (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason VARCHAR(255),
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    );
  `);
};

createAbsenceTable();
