const pool = require('../config/db');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.getAllEmployees = async (req, res) => {
    try {
      const allEmployees = await pool.query('SELECT * FROM employees');
      res.json(allEmployees.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  exports.addEmployee = async (req, res) => {
    const { name, position, no, email } = req.body;
    try {
      const newEmployee = await pool.query(
        'INSERT INTO employees (name, position, no, email) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, position, no, email]
      );
      res.json(newEmployee.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, position, no, email } = req.body;
    try {
      const updatedEmployee = await pool.query(
        'UPDATE employees SET name = $1, position = $2, no = $3, email = $4 WHERE id = $5 RETURNING *',
        [name, position, no, email, id]
      );
      if (updatedEmployee.rows.length === 0) {
        return res.status(404).json({ message: `Employee with ID ${id} not found.` });
      }
      res.json(updatedEmployee.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedEmployee = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
      if (deletedEmployee.rows.length === 0) {
        return res.status(404).json({ message: `Employee with ID ${id} not found.` });
      }
      res.json({ message: `Employee with ID ${id} has been deleted.` });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
      if (employee.rows.length === 0) {
        return res.status(404).json({ message: `Employee with ID ${id} not found.` });
      }
      res.json(employee.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

