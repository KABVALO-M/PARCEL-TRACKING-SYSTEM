// routes/panel.js

const express = require('express');
const router = express.Router();

// Middleware to ensure user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Dashboard route
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

module.exports = router;
