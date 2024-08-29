const passport = require('../config/passport');
const { createUser } = require('../models/User');

module.exports = function(app) {
  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ user: req.user });
  });

  app.post('/register', async (req, res, next) => {
    try {
      const { email, password, role } = req.body;

      // Tambahkan user baru ke PostgreSQL
      const newUser = await createUser(email, password, role);

      // Autentikasi user setelah registrasi
      req.login(newUser, (err) => {
        if (err) return next(err);
        return res.json({ user: newUser });
      });
    } catch (err) {
      return next(err);
    }
  });
};
