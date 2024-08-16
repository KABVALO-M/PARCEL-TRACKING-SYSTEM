const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');
const isAuthenticated = require('../middleware/authenticated'); 

// Dashboard route
router.get('/dashboard', isAuthenticated, parcelController.renderDashboard);

router.get('/sending', isAuthenticated, parcelController.renderSending);
router.post('/add-parcel', isAuthenticated, parcelController.addParcel);

// Route to display delivered parcels
router.get('/collecting', isAuthenticated, parcelController.getDeliveredParcels);




module.exports = router;
