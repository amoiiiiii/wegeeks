const Pool = require('pg').Pool

const pool = new Pool({
    user:"postgres",
    password:"082411",
    database:"employee_absence",
    host:"localhost",
    port:5432
})

module.exports = pool
