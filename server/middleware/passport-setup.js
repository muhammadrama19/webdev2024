const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BACKEND_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Existing user check by Google ID
    const [existingUserByGoogleId] = await db.promise().query('SELECT * FROM users WHERE googleId = ?', [profile.id]);

    if (existingUserByGoogleId.length > 0) {
      return done(null, existingUserByGoogleId[0]);
    }

    // Check if suspended
    const [suspendedUser] = await db.promise().query('SELECT * FROM users WHERE googleId = ? AND Status_Account = ?', [profile.id, '2']);
    if (suspendedUser.length > 0) {
      return done(null, false, { message: 'Your account has been suspended. Please contact the administrator.' });
    }

    // Check if user exists by email but no Google ID
    const [existingUserByEmail] = await db.promise().query('SELECT * FROM users WHERE email = ?', [profile.emails[0].value]);
    if (existingUserByEmail.length > 0) {
      return done(null, false, { message: 'Please log in using your email and password.' });
    }

    // Create a new user if no existing user
    const [newUser] = await db.promise().query('INSERT INTO users (googleId, email, username, role, isEmailConfirmed) VALUES (?, ?, ?, ?, ?)', [profile.id, profile.emails[0].value, profile.displayName, 'User', 1]);

    if (newUser.affectedRows > 0) {
      const [createdUser] = await db.promise().query('SELECT * FROM users WHERE id = ?', [newUser.insertId]);
      return done(null, createdUser[0]);
    } else {
      return done(new Error('Failed to create new user'), null);
    }
  } catch (err) {
    return done(err, null);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length > 0) {
      done(null, rows[0]); // Attach user data to req.user
    } else {
      done(new Error('User not found'), null);
    }
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
