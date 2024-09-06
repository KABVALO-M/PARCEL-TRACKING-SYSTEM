const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');
const isAuthenticated = require('../middleware/authenticated'); 

router.get('/sending', isAuthenticated, parcelController.renderSending);
router.post('/add-parcel', isAuthenticated, parcelController.addParcel);
router.get('/collecting', isAuthenticated, parcelController.getDeliveredParcels);
router.post('/location', parcelController.handleSmsReceived);

module.exports = router;
