const express = require('express');
const db = require('../db'); // Modul untuk koneksi ke database

const router = express.Router();

// Endpoint untuk mencatat aktivitas log aplikasi
router.post('/', async (req, res) => {
  try {
    const { userId, activity } = req.body;

    // Simpan log aktivitas ke database
    const newLog = await db.query(
      'INSERT INTO logs (user_id, activity) VALUES ($1, $2) RETURNING *',
      [userId, activity]
    );

    res.status(201).json(newLog.rows[0]);
  } catch (err) {
    console.error('Error creating log:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mendapatkan semua log aktivitas
router.get('/', async (req, res) => {
  try {
    const logs = await db.query('SELECT * FROM logs');
    res.status(200).json(logs.rows);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
