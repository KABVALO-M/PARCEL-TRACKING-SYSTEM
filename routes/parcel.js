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
router.post('/branches/add', isAuthenticated, parcelController.addBranch);

// Route to render staff page
router.get('/staff', isAuthenticated, parcelController.renderStaff);

// Route to handle adding new staff
router.post('/staff/add', isAuthenticated, parcelController.addStaff);
router.post('/staff/add', isAuthenticated, parcelController.addStaff);

router.get('/sending', isAuthenticated, parcelController.renderSending);
router.post('/add-parcel', isAuthenticated, parcelController.addParcel);

module.exports = router;
