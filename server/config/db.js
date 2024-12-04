require("dotenv").config();
const mysql = require('mysql2');

// MySQL connection setup
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const db = mysql.createConnection(dbConfig);

const connectWithRetry = () => {
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    } else {
      console.log("Connected to MySQL!");
    }
  });
};

connectWithRetry();
module.exports = db;
