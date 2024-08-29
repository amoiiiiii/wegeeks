const controller = require("../controllers/attendanceController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/attendance", controller.getAllAttendance);
  app.post("/attendance", controller.createAttendance);
  app.get("/attendance/checkAttendance", controller.checkAttendance); // Perbaiki jalur dengan menambahkan '/'
  app.delete('/attendance/:id_user', controller.deleteAttendance);  
  app.get('/attendance/:id_user', controller.getAttendanceById);  
  app.put('/attendance/:id_user', controller.updateAttendance); 
  app.get('/api/attendance/today', controller.getAttendanceToday);
  app.get('/attendance/status', controller.getAttendanceStatus);
};
