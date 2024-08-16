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
// router.post('/staff/add', isAuthenticated, parcelController.addStaff);

router.get('/sending', isAuthenticated, parcelController.renderSending);
router.post('/add-parcel', isAuthenticated, parcelController.addParcel);

// Route to display delivered parcels
router.get('/collecting', isAuthenticated, parcelController.getDeliveredParcels);

// Route for tracking devices
router.get('/devices', isAuthenticated, parcelController.getTrackingDevices);

// Route for adding a new tracking device
router.post('/add-device', isAuthenticated, parcelController.addTrackingDevice);

// Vehicle Routes
router.get('/vehicles', isAuthenticated, parcelController.getVehicles);
router.post('/vehicles/add', isAuthenticated, parcelController.addVehicle);

module.exports = router;
