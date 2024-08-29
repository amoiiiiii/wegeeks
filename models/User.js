const pool = require('../config/db');

async function createUser(email, password, role) {
  const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *';
  const values = [email, password, role];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    throw new Error(err);
  }
}

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  createUser,
  findUserByEmail
};
