const mysql = require("mysql2"); // Import mysql2 promise version

// Create a pool to manage the database connections
const db = mysql.createConnection({
  host: 'localhost',    // Replace with your database host
  user: 'root',         // Replace with your database user
  password: '0787',     // Replace with your database password
  database: 'attendance',
  port: '3308'          // Specify the port if needed
});



module.exports = db;
