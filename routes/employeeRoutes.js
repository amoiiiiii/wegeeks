const express = require('express');
const db = require('../db'); // Modul untuk koneksi ke database

const router = express.Router();

// Endpoint untuk membuat karyawan baru
router.post('/', async (req, res) => {
  try {
    const { nama, jabatan } = req.body;

    // Simpan data karyawan baru ke database
    const newEmployee = await db.query(
      'INSERT INTO employees (nama, jabatan) VALUES ($1, $2) RETURNING *',
      [nama, jabatan]
    );

    res.status(201).json(newEmployee.rows[0]);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mendapatkan daftar semua karyawan
router.get('/', async (req, res) => {
  try {
    const employees = await db.query('SELECT * FROM employees');
    res.status(200).json(employees.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mengupdate data karyawan berdasarkan ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jabatan } = req.body;

    const updatedEmployee = await db.query(
      'UPDATE employees SET nama = $1, jabatan = $2 WHERE id = $3 RETURNING *',
      [nama, jabatan, id]
    );

    if (updatedEmployee.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee.rows[0]);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk menghapus data karyawan berdasarkan ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await db.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);

    if (deletedEmployee.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
