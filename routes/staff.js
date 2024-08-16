const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const isAuthenticated = require('../middleware/authenticated'); 

router.get('/', isAuthenticated, staffController.renderStaff);
router.post('/add', isAuthenticated, staffController.addStaff);

module.exports = router;