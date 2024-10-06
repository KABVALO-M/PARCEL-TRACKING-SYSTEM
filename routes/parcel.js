const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');
const isAuthenticated = require('../middleware/authenticated'); 

router.get('/sending', isAuthenticated, parcelController.renderSending);
router.post('/add-parcel', isAuthenticated, parcelController.addParcel);
router.get('/collecting', isAuthenticated, parcelController.getDeliveredParcels);
router.post('/location', parcelController.handleSmsReceived);

router.put('/update-parcel/:parcelId', isAuthenticated, parcelController.updateParcel);
router.delete('/delete/:parcelId', isAuthenticated, parcelController.deleteParcel);
router.get('/assign-parcels', parcelController.assignParcelsPage);
router.put('/assign-parcels', parcelController.assignParcels);


module.exports = router;
