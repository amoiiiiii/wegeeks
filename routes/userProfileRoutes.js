const controller = require("../controllers/userProfileController");
const upload = require("../middlewares/upload");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/user/profile/:id", controller.getUserProfile); 
  app.post("/user/profile", controller.createUserProfile); 
  app.put("/user/profile/:id", controller.updateUserProfile); 
  app.delete("/user/profile/:id", controller.deleteUserProfile); 
  
  // Rute untuk mengunggah foto profil
  app.put("/user/profile/:id/picture", upload.single('profile_picture'), controller.uploadProfilePicture);
};
