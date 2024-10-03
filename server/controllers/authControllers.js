const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mysql = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage });

// Helper function to send emails
const sendEmail = (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CREDENTIALS_SENDER_EMAIL,
      pass: process.env.CREDENTIALS_SENDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.CREDENTIALS_SENDER_EMAIL,
    to: email,
    subject: subject,
    text: text,
  };

  return transporter.sendMail(mailOptions);
};

const signup = async (req, res) => {
  const { username, password } = req.body;
  const profilePicture = req.file ? req.file.filename : null; // Get uploaded file name

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    mysql.query(
      'INSERT INTO users (username, password, profile_picture) VALUES (?, ?, ?)',
      [username, hashedPassword, profilePicture],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: 'User created successfully!' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sign In
const signin = async (req, res) => {
  const { username, password } = req.body;

  mysql.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    }
  );
};

// Forgot Password
const forgotPassword = (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

  // Send OTP to the user's email
  sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`)
    .then(() => {
      // Store OTP in the database (this can be improved by storing in a temp table)
      mysql.query(
        'UPDATE users SET otp = ? WHERE email = ?',
        [otp, email],
        (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({ message: 'OTP sent to your email.' });
        }
      );
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error sending email: ' + error.message });
    });
};


module.exports = {
  signup,
  signin,
  forgotPassword,
  upload,
};
