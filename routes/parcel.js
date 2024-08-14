const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');

// Middleware to ensure user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Dashboard route
router.get('/dashboard', isAuthenticated, parcelController.renderDashboard);

// Branches route
router.get('/branches', isAuthenticated, parcelController.renderBranches);

// Route to handle adding a new branch
router.post('/branches/add', parcelController.addBranch);

module.exports = router;
