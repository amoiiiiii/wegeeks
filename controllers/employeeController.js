// controllers/employeeController.js
const pool = require('../config/db');

const getAllEmployees = async (req, res) => {
  try {
    const allEmployees = await pool.query('SELECT * FROM employees');
    res.json(allEmployees.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const addEmployee = async (req, res) => {
  const { name, position } = req.body;
  try {
    const newEmployee = await pool.query(
      'INSERT INTO employees (name, position) VALUES ($1, $2) RETURNING *',
      [name, position]
    );
    res.json(newEmployee.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, position } = req.body;
  try {
    const updatedEmployee = await pool.query(
      'UPDATE employees SET name = $1, position = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, position, id]
    );
    res.json(updatedEmployee.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
