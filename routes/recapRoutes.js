const recapController = require('../controllers/recapController');

module.exports = function(app) {
  // Middleware to set CORS headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  // Routes for recap management
  app.get("/api/recap/all", recapController.getAllRecap);
  app.get("/api/recap/username/:username", recapController.getRecapByUsername);

  // Other routes
};
