const express = require('express');
const router = express.Router();
const { signup, signin, forgotPassword, upload } = require('../controllers/authControllers');

// Sign Up route
router.post('/signup', upload.single('profile_picture'), signup);

// Sign In route
router.post('/signin', signin);

// Forgot Password route
router.post('/forgot-password', forgotPassword);

// Password Reset route (Add your route implementation here)

module.exports = router;
