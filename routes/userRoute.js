const controller = require("../controllers/userController");
const checkTokenBlacklist = require("../middlewares/checkTokenBlacklist");
const { verifyToken, isAdmin, isSuperAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/image/users' });
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    ); 
    next();
  });

  app.post("/api/auth/register", controller.register);
  app.post("/api/auth/login", controller.login);
  app.post("/api/auth/logout", checkTokenBlacklist, controller.logout);
  app.get("/api/auth/user", verifyToken, controller.getAllUsers);
  app.put("/api/auth/user/:id/updateToAdmin", verifyToken, isSuperAdmin, controller.updateUserToAdmin);
  app.get("/user/:id",  controller.getUserById);
  app.delete("/api/auth/user/:id", verifyToken, isAdmin, controller.deleteUser);
  app.put("/api/auth/user/:id/profile-picture", verifyToken, controller.updateProfilePicture);
  app.put("/api/users/:id", verifyToken, isAdmin, controller.updateUser);
  app.put("/api/auth/user/change-password", verifyToken, controller.changePassword);
  app.put("/api/auth/user/:id/status", verifyToken, isSuperAdmin, controller.updateUserStatus); 
  app.post("/api/auth/user/:id/reset-password", verifyToken, isAdmin, controller.resetPassword);
};
