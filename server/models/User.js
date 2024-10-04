const db = require('../config/db');

const User = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  },

  findByGoogleId: (googleId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE googleId = ?', [googleId], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  },

  create: (username, email, hashedPassword, role, googleId = null) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users (username, email, password, role, googleId) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role, googleId], (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        });
    });
  },

  updateGoogleId: (email, googleId) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET googleId = ? WHERE email = ?', [googleId, email], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      });
    });
  }
};

module.exports = User;
