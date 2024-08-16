const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const isAuthenticated = require('../middleware/authenticated'); 

// Vehicle Routes
router.get('/', isAuthenticated, vehicleController.getVehicles);
router.post('/add', isAuthenticated, vehicleController.addVehicle);

module.exports = router;