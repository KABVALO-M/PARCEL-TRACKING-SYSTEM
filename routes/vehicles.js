const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const isAuthenticated = require('../middleware/authenticated'); 

// Vehicle Routes
router.get('/', isAuthenticated, vehicleController.getVehicles);
router.post('/add', isAuthenticated, vehicleController.addVehicle);
router.post('/edit/:id', isAuthenticated, vehicleController.updateVehicle);
router.post('/delete/:id', isAuthenticated, vehicleController.deleteVehicle);

module.exports = router;