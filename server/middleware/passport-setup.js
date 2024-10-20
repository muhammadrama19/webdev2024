const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db');
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8001/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const [existingUserByGoogleId] = await db.promise().query(
      'SELECT * FROM users WHERE googleId = ?', [profile.id]
    );

    if (existingUserByGoogleId.length > 0) {
      // User exists by Google ID, log them in
      console.log('User already exists by Google ID:', existingUserByGoogleId[0]);
      return done(null, existingUserByGoogleId[0]);
    }

    // Check if the user exists by email but has no Google ID
    const [existingUserByEmail] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?', [profile.emails[0].value]
    );

    if (existingUserByEmail.length > 0) {
      if (!existingUserByEmail[0].googleId) {
     
        console.log('User exists with email but no Google ID:', existingUserByEmail[0]);
        return done(null, false, { message: 'Please log in using your email and password.' });
      }
    }

    // Create a new user if no existing user is found
    const [newUser] = await db.promise().query(
      'INSERT INTO users (googleId, email, username, role, isEmailConfirmed) VALUES (?, ?, ?, ?, ?)',
      [profile.id, profile.emails[0].value, profile.displayName, 'User', 1] // Default role is 'User'
    );

    if (newUser.affectedRows > 0) {
      const user = { id: newUser.insertId, googleId: profile.id, email: profile.emails[0].value, username: profile.displayName };
      console.log('New user created:', user);
      return done(null, user);
    } else {
      console.error('Failed to create new user');
      return done(new Error('Failed to create user'), null);
    }
  } catch (err) {
    console.error('Error during Google strategy:', err);
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
