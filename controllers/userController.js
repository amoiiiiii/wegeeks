const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwtConfig = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const validator = require('validator');

exports.register = async (req, res) => {
  const { username, email, password, role, no, position } = req.body;

  try {
    const allowedRoles = ['user', 'admin', 'super_admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if email already exists
    const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const status = 'active'; // Default status

    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, no, position, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, role, no, position, status',
      [username, email, hashedPassword, role, no, position, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in registration:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'User account is not active' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.json({ message: 'Login successful', token, role: user.role, id: user.id });
  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, no, position, role FROM users');
    const users = result.rows;

    const adminUsers = users.filter(user => user.role === 'admin');
    const regularUsers = users.filter(user => user.role === 'user');
    const superAdminUsers = users.filter(user => user.role === 'super_admin');

    res.json({ adminUsers, regularUsers, superAdminUsers });
  } catch (err) {
    console.error('Error in fetching users:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.updateUserToAdmin = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', ['admin', userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user to admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleting user:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await pool.query('INSERT INTO token_blacklist (token) VALUES ($1)', [token]);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error in logging out:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.updateProfilePicture = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture;
      const ext = path.extname(file.name).toLowerCase();
      const fileName = file.md5 + ext;
      const allowedTypes = ['.png', '.jpg', '.jpeg'];

      // Validasi tipe file
      if (!allowedTypes.includes(ext)) {
        return res.status(422).json({ msg: 'Invalid Image Type' });
      }

      // Validasi ukuran file
      if (file.size > 5000000) { // 5MB
        return res.status(422).json({ msg: 'Image must be less than 5MB' });
      }

      // Path penyimpanan file
      const filePath = path.join(__dirname, '../public/uploads/image/users/', fileName);
      await file.mv(filePath); // Memindahkan file ke path yang ditentukan

      // Update profil gambar dan URL di database
      const url = `/uploads/image/users/${fileName}`;
      await pool.query(
        'UPDATE users SET profile_picture = $1, url = $2 WHERE id = $3',
        [fileName, url, userId]
      );

      return res.status(200).json({ message: 'Profile picture updated successfully', url });
    } else {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error); // Menampilkan pesan kesalahan
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, username, email, role, profile_picture, url, no, position FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract user data
    const user = result.rows[0];

    user.profile_picture_url = `http://localhost:8080/profile-pictures${user.url}${user.profile_picture}`;


    // Send response
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error while fetching user by ID' });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role, position, no } = req.body;

  try {
    // Validate inputs (e.g., check if required fields are present)
    if (!username || !email || !role || !position || !no) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Update user query
    const result = await pool.query(
      `UPDATE users 
       SET username = $1, email = $2, role = $3, position = $4, no = $5 
       WHERE id = $6 
       RETURNING *`,
      [username, email, role, position, no, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = result.rows[0];
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validasi status yang diizinkan
    const allowedStatuses = ['active', 'inactive'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update status di database
    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, username, email, status',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user status:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.resetPassword = async (req, res) => {
  const userId = req.params.id;
  const defaultPassword = 'defaultpassword'; // Ubah sesuai password default yang diinginkan

  try {
    // Cek apakah pengguna ada
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Enkripsi password default
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Update password di database
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password has been reset to default' });
  } catch (err) {
    console.error('Error resetting password:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
