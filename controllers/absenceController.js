require('dotenv').config(); 
const path = require('path');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const { format } = require('date-fns'); // Import date-fns for formatting

console.log('JWT_SECRET:', process.env.JWT_SECRET);
// Get all absences
exports.getAllAbsences = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_user, start_date, end_date, reason, url, username FROM absences');

    const formattedResults = result.rows.map(row => ({
      ...row,
      start_date: format(new Date(row.start_date), 'dd-MM-yyyy'),
      end_date: format(new Date(row.end_date), 'dd-MM-yyyy'),
      url: row.url ? `http://localhost:8080${row.url}` : null,
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error('Error fetching absences:', err.message);
    res.status(500).json({ message: 'Failed to retrieve absences' });
  }
};

// Get absence by id_user
exports.getAbsenceById = async (req, res) => {
  try {
    const { id_user } = req.params;
    const result = await pool.query('SELECT * FROM absences WHERE id_user = $1', [id_user]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Absence not found' });

    const row = result.rows[0];
    row.start_date = format(new Date(row.start_date), 'dd-MM-yyyy');
    row.end_date = format(new Date(row.end_date), 'dd-MM-yyyy');

    res.json(row);
  } catch (err) {
    console.error('Error fetching absence:', err.message);
    res.status(500).json({ message: 'Failed to retrieve absence' });
  }
};

exports.createAbsence = async (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];
  const file = req.files ? req.files.file : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret); // Pastikan jwtConfig.secret ada dan benar
    const userId = decoded.id;

    // Fetch username from the database using userId
    const userResult = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
    const username = userResult.rows[0]?.username;

    if (!username) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    let fileUrl = null;

    if (file) {
      const ext = path.extname(file.name).toLowerCase();
      const fileName = file.md5 + ext;
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.pdf'];

      if (!allowedTypes.includes(ext)) {
        return res.status(422).json({ message: 'Invalid file type' });
      }

      if (file.size > 5000000) {
        return res.status(422).json({ message: 'File must be less than 5MB' });
      }

      const filePath = path.join(__dirname, '../public/upload/absences/', fileName);

      await file.mv(filePath);
      
      fileUrl = `/upload/absences/${fileName}`;
    }

    const result = await pool.query(
      'INSERT INTO absences (id_user, start_date, end_date, reason, url, username) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, start_date, end_date, reason, fileUrl, username]
    );

    const row = result.rows[0];
    row.start_date = format(new Date(row.start_date), 'dd-MM-yyyy');
    row.end_date = format(new Date(row.end_date), 'dd-MM-yyyy');
    row.username = username;

    res.status(201).json(row);
  } catch (err) {
    console.error('Error creating absence:', err.message);
    res.status(500).json({ message: 'Server Error: Unable to create absence record', error: err.message });
  }
};
// Update an existing absence
exports.updateAbsence = async (req, res) => {
  const { id_user } = req.params;
  const { start_date, end_date, reason, url } = req.body;

  if (!id_user) {
    return res.status(400).json({ message: 'id_user is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE absences SET start_date = $1, end_date = $2, reason = $3, url = $4 WHERE id_user = $5 RETURNING *',
      [start_date, end_date, reason, url, id_user]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Absence not found' });

    const row = result.rows[0];
    row.start_date = format(new Date(row.start_date), 'dd-MM-yyyy');
    row.end_date = format(new Date(row.end_date), 'dd-MM-yyyy');

    res.json(row);
  } catch (err) {
    console.error('Error updating absence:', err.message);
    res.status(500).json({ message: 'Server Error: Unable to update absence record' });
  }
};

// Delete an absence
exports.deleteAbsence = async (req, res) => {
  const { id_user } = req.params;

  try {
    const result = await pool.query('DELETE FROM absences WHERE id_user = $1 RETURNING *', [id_user]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Absence not found' });

    res.json({ message: 'Absence deleted' });
  } catch (err) {
    console.error('Error deleting absence:', err.message);
    res.status(500).json({ message: 'Server Error: Unable to delete absence record' });
  }
};
