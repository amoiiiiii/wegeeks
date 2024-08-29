const pool = require('../config/db');

const checkTokenBlacklist = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const result = await pool.query('SELECT token FROM token_blacklist WHERE token = $1', [token]);
    if (result.rows.length > 0) {
      return res.status(401).json({ message: 'Token blacklisted' });
    }

    next();
  } catch (err) {
    console.error('Error in checking token blacklist:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = checkTokenBlacklist;
