
const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const dbConfig = require("./config/db");
// const db = require("./app/models");
const checkTokenBlacklist = require('./middlewares/checkTokenBlacklist');
var bodyParser = require('body-parser');
const path = require("path");
const authRoutes = require('./routes/auth');
require('dotenv').config();
global.__basedir = __dirname;

const app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// parse requests of content-type - application/json
app.use(express.json());
app.use(fileUpload());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

app.use(bodyParser.json({
  limit: "100mb"
}));
app.use(bodyParser.urlencoded({
  limit: "100mb",
  extended: true,
  parameterLimit: 50000
}));

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to globotix application."
  });
});
app.use('/api/auth', authRoutes);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
require("./routes/userRoute")(app);
require("./routes/absenceRoutes")(app);
require("./routes/attendanceRoutes")(app);
require("./routes/recapRoutes")(app);

app.use('/uploads', express.static('public/uploads'));
app.use('/upload', express.static('public/upload'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});