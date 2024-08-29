const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

// Endpoint untuk memeriksa autentikasi dan mengembalikan informasi pengguna
router.get('/check', verifyToken, (req, res) => {
  // req.user sudah tersedia setelah melalui middleware verifyToken
  // Mengembalikan informasi peran pengguna
  res.json({ role: req.user.role });
});

module.exports = router;