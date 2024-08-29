const passport = require('passport');

exports.loginAdmin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ user });
    });
  })(req, res, next);
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user || user.role !== 'user') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ user });
    });
  })(req, res, next);
};

exports.loginSuperAdmin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user || user.role !== 'super_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ user });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
};
