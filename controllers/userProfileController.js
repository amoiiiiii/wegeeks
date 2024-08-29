const pool = require('../config/db');
const path = require('path');

exports.getUserProfile = async (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  
  try {
    const result = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [user_id]);
    
    if (result.rows.length > 0) {
      const profile = result.rows[0];
      profile.profile_picture = profile.profile_picture ? `/uploads/${profile.profile_picture}` : null;
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUserProfile = async (req, res) => {
  const { user_id } = req.body;
  const profile_picture = req.file ? req.file.filename : null;
  
  try {
    const result = await pool.query(
      'INSERT INTO user_profiles (user_id, profile_picture) VALUES ($1, $2) RETURNING *',
      [user_id, profile_picture]
    );
    
    const profile = result.rows[0];
    profile.profile_picture = profile.profile_picture ? `/uploads/${profile.profile_picture}` : null;
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  const profile_picture = req.file ? req.file.filename : req.body.profile_picture;
  
  try {
    const result = await pool.query(
      'UPDATE user_profiles SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [profile_picture, user_id]
    );
    
    if (result.rows.length > 0) {
      const profile = result.rows[0];
      profile.profile_picture = profile.profile_picture ? `/uploads/${profile.profile_picture}` : null;
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUserProfile = async (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  
  try {
    const result = await pool.query(
      'DELETE FROM user_profiles WHERE user_id = $1 RETURNING *',
      [user_id]
    );
    
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'User profile deleted successfully' });
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  const profile_picture = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      'UPDATE user_profiles SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [profile_picture, user_id]
    );

    if (result.rows.length > 0) {
      const profile = result.rows[0];
      profile.profile_picture = profile.profile_picture ? `/uploads/${profile.profile_picture}` : null;
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
