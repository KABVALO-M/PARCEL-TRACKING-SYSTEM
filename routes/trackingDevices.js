const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/trackingDeviceController');
const isAuthenticated = require('../middleware/authenticated'); 

// Route for tracking devices
router.get('/', isAuthenticated, deviceController.getTrackingDevices);
router.post('/add', isAuthenticated, deviceController.addTrackingDevice);
router.post('/edit/:deviceId', isAuthenticated, deviceController.editDevice);
router.post('/delete/:id', deviceController.deleteTrackingDevice);

module.exports = router;