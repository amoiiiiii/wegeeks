const pool = require('../config/db'); // Pastikan path ini sesuai dengan lokasi file db.js
const { format } = require('date-fns');

exports.getAllRecap = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Fetch attendance data with date filtering
        const attendanceQuery = `
            SELECT a.*, u.username
            FROM attendance a
            JOIN users u ON a.id_user = u.id
            WHERE ($1::date IS NULL OR a.check_in_date >= $1::date)
            AND ($2::date IS NULL OR a.check_in_date <= $2::date)
        `;
        const attendanceResult = await pool.query(attendanceQuery, [startDate || null, endDate || null]);

        // Fetch absence data with date filtering
        const absencesQuery = `
            SELECT a.*, u.username
            FROM absences a
            JOIN users u ON a.id_user = u.id
            WHERE ($1::date IS NULL OR a.start_date >= $1::date)
            AND ($2::date IS NULL OR a.end_date <= $2::date)
        `;
        const absencesResult = await pool.query(absencesQuery, [startDate || null, endDate || null]);

        console.log('Attendance Results:', attendanceResult.rows);
        console.log('Absences Results:', absencesResult.rows);

        // Organize attendance data by user
        const attendanceByUser = {};
        attendanceResult.rows.forEach(row => {
            const userId = row.id_user;
            if (!attendanceByUser[userId]) {
                attendanceByUser[userId] = { attendance: [], absences: [], username: row.username };
            }
            attendanceByUser[userId].attendance.push({
                ...row,
                check_in_date: format(new Date(row.check_in_date), 'dd-MM-yyyy'),
                check_in_time: row.check_in_time ? format(new Date(row.check_in_time), 'HH:mm:ss') : null,
                check_out_time: row.check_out_time ? format(new Date(row.check_out_time), 'HH:mm:ss') : null,
            });
        });

        // Organize absence data by user
        absencesResult.rows.forEach(row => {
            const userId = row.id_user;
            if (!attendanceByUser[userId]) {
                attendanceByUser[userId] = { attendance: [], absences: [], username: row.username };
            }
            attendanceByUser[userId].absences.push({
                ...row,
                start_date: format(new Date(row.start_date), 'dd-MM-yyyy'),
                end_date: format(new Date(row.end_date), 'dd-MM-yyyy'),
            });
        });

        // Format the final response
        const recapData = Object.keys(attendanceByUser).map(userId => {
            const userRecap = attendanceByUser[userId];
            return {
                id_user: parseInt(userId, 10),
                username: userRecap.username,
                ...userRecap,
                attendance_count: userRecap.attendance.length,
                absences_count: userRecap.absences.length,
            };
        });

        if (recapData.length === 0) {
            return res.status(404).json({ message: 'Data not found for the selected dates.' });
        }

        res.status(200).json(recapData);
    } catch (err) {
        console.error('Error fetching all recap data:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getRecapByUsername = async (req, res) => {
  const username = req.params.username;
  const { startDate, endDate } = req.query;

  try {
      // Fetch attendance data for the specific user with date filtering
      const attendanceQuery = `
          SELECT a.*, u.username
          FROM attendance a
          JOIN users u ON a.id_user = u.id
          WHERE u.username = $1
          AND ($2::date IS NULL OR a.check_in_date >= $2::date)
          AND ($3::date IS NULL OR a.check_in_date <= $3::date)
      `;
      const attendanceResult = await pool.query(attendanceQuery, [username, startDate || null, endDate || null]);

      // Fetch absence data for the specific user with date filtering
      const absencesQuery = `
          SELECT a.*, u.username
          FROM absences a
          JOIN users u ON a.id_user = u.id
          WHERE u.username = $1
          AND ($2::date IS NULL OR a.start_date >= $2::date)
          AND ($3::date IS NULL OR a.end_date <= $3::date)
      `;
      const absencesResult = await pool.query(absencesQuery, [username, startDate || null, endDate || null]);

      console.log('Attendance Results:', attendanceResult.rows);
      console.log('Absences Results:', absencesResult.rows);

      // Organize attendance data
      const userRecap = {
          username: attendanceResult.rows[0] ? attendanceResult.rows[0].username : '',
          attendance: attendanceResult.rows.map(row => ({
              ...row,
              check_in_date: format(new Date(row.check_in_date), 'dd-MM-yyyy'),
              check_in_time: row.check_in_time ? format(new Date(row.check_in_time), 'HH:mm:ss') : null,
              check_out_time: row.check_out_time ? format(new Date(row.check_out_time), 'HH:mm:ss') : null,
          })),
          absences: absencesResult.rows.map(row => ({
              ...row,
              start_date: format(new Date(row.start_date), 'dd-MM-yyyy'),
              end_date: format(new Date(row.end_date), 'dd-MM-yyyy'),
          })),
          attendance_count: attendanceResult.rows.length,
          absences_count: absencesResult.rows.length,
      };

      if (userRecap.attendance_count === 0 && userRecap.absences_count === 0) {
          return res.status(404).json({ message: 'Data not found for the selected dates.' });
      }

      res.status(200).json(userRecap);
  } catch (err) {
      console.error('Error fetching recap data by username:', err.message);
      res.status(500).json({ message: 'Server Error' });
  }
};
