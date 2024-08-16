const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/trackingDeviceController');
const isAuthenticated = require('../middleware/authenticated'); 

// Route for tracking devices
router.get('/', isAuthenticated, deviceController.getTrackingDevices);
router.post('/add', isAuthenticated, deviceController.addTrackingDevice);

module.exports = router;