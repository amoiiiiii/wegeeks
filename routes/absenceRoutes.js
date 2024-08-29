const controller = require("../controllers/absenceController");

module.exports = function(app) {
  // Middleware to set CORS headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH"); // Add the methods you need
    res.header("Access-Control-Allow-Origin", "*"); // Adjust this for security needs
    next();
  });

  // Routes for absence management
  app.get("/api/absences", controller.getAllAbsences);
  app.post("/api/absence", controller.createAbsence);
  app.get("/api/absence/:id_user", controller.getAbsenceById);
  app.put("/api/absence/:id_user", controller.updateAbsence);
  app.delete("/api/absence/:id_user", controller.deleteAbsence);
};
