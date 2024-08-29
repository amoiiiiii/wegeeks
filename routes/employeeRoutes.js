const controller = require("../controllers/employeeController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.getAllEmployees);
  app.post("/api/employee", controller.addEmployee);
  app.get("/api/employees/:id", controller.getEmployeeById);
  app.put("/api/employees/:id", controller.updateEmployee);
  app.delete("/api/employees/:id", controller.deleteEmployee);
};
