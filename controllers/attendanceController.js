const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const moment = require('moment-timezone');

// Function to get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching all attendance records:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createAttendance = async (req, res) => {
  const { status } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const userId = decoded.id;

    // Get the username from the database
    const userResult = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
    const username = userResult.rows[0]?.username;

    if (!username) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    const currentDateTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    // Check for existing attendance record for the current date
    const checkResult = await pool.query(
      'SELECT * FROM attendance WHERE id_user = $1 AND check_in_date = $2',
      [userId, currentDate]
    );

    if (status === 'check-in') {
      // Check-in logic
      if (checkResult.rows.length > 0) {
        return res.status(400).json({ message: 'Attendance already recorded for today' });
      }

      const result = await pool.query(
        'INSERT INTO attendance (id_user, check_in_date, status, username, check_in_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, currentDate, 'work', username, currentDateTime]
      );

      res.status(201).json(result.rows[0]);

    } else if (status === 'check-out') {
      // Check-out logic
      if (checkResult.rows.length === 0) {
        return res.status(400).json({ message: 'Check-in record not found. You must check in before checking out.' });
      }

      // Update the record to set check-out time and change status
      const updateResult = await pool.query(
        'UPDATE attendance SET check_out_time = $1, status = $2 WHERE id_user = $3 AND check_in_date = $4 AND check_out_time IS NULL RETURNING *',
        [currentDateTime, 'worked', userId, currentDate]
      );

      if (updateResult.rows.length === 0) {
        return res.status(400).json({ message: 'Check-out already recorded or no check-in record found.' });
      }

      res.status(200).json(updateResult.rows[0]);

    } else {
      return res.status(400).json({ message: 'Invalid status' });
    }
  } catch (err) {
    console.error('Error processing attendance:', err.message);
    res.status(500).json({ message: 'Server Error: Unable to process attendance record' });
  }
};

exports.checkAttendance = async (req, res) => {
  const userId = parseInt(req.query.user_id, 10);
  const date = req.query.date;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE userId = $1 AND check_in_date = $2',
      [userId, date]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Attendance not found' });
    }
  } catch (err) {
    console.error('Error fetching attendance:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.deleteAttendance = async (req, res) => {
  const { id_user } = req.params;
  
  if (!id_user) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await pool.query('DELETE FROM attendance WHERE id_user = $1 RETURNING *', [id_user]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    console.error('Error deleting attendance:', err.message);
    res.status(500).json({ message: 'Server Error: Failed to delete attendance' });
  }
};
// Function to get a specific user's attendance by user ID
exports.getAttendanceById = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await pool.query('SELECT * FROM attendance WHERE userId = $1', [userId]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Attendance not found' });
    }
  } catch (err) {
    console.error('Error fetching attendance:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Function to update a specific user's attendance by user ID
exports.updateAttendance = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { status, check_in_time, check_out_time } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await pool.query(
      'UPDATE attendance SET status = $1, check_in_time = $2, check_out_time = $3 WHERE userId = $4 RETURNING *',
      [status, check_in_time, check_out_time, userId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Attendance not found' });
    }
  } catch (err) {
    console.error('Error updating attendance:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAttendanceToday = async (req, res) => {
  const currentDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

  try {
    // Query untuk mengambil data absensi hari ini tanpa data dummy
    const attendanceQuery = `
      SELECT a.id_user, u.username, a.check_in_date, a.status, a.check_in_time, a.check_out_time
      FROM attendance a
      JOIN users u ON a.id_user = u.id
      WHERE DATE(a.check_in_date) = $1 AND a.is_dummy = false
      ORDER BY a.check_in_time ASC
    `;

    // Mengambil data absensi hari ini
    const result = await pool.query(attendanceQuery, [currentDate]);

    // Query untuk mengambil data absensi keseluruhan
    const absenceQuery = "SELECT * FROM absences";
    const absenceResult = await pool.query(absenceQuery);

    // Mengirimkan respons dengan data absensi hari ini dan jumlah yang sesuai
    res.status(200).json({
      date: currentDate,
      attendanceData: result.rows,  // Data absensi hari ini
      absenceData: absenceResult.rows, // Data absensi keseluruhan
      counts: {
        attendance: result.rowCount,  // Jumlah data absensi hari ini
        absence: absenceResult.rowCount, // Jumlah data absensi keseluruhan
      }
    });
  } catch (err) {
    console.error('Error fetching today\'s attendance:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
// Function to get attendance status for a specific user and date
exports.getAttendanceStatus = async (req, res) => {
  const user_id = parseInt(req.query.user_id, 10);
  const date = req.query.date;

  if (isNaN(user_id) || !date) {
    return res.status(400).json({ message: 'User ID dan tanggal diperlukan.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE userId = $1 AND check_in_date = $2',
      [user_id, date]
    );

    if (result.rows.length > 0) {
      res.status(200).json({
        check_in_time: result.rows[0].check_in_time,
        check_out_time: result.rows[0].check_out_time
      });
    } else {
      res.status(404).json({ message: 'Absensi tidak ditemukan.' });
    }
  } catch (err) {
    console.error('Error checking attendance status:', err.message);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};
