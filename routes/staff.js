const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const isAuthenticated = require('../middleware/authenticated'); 

router.get('/', isAuthenticated, staffController.renderStaff);
router.post('/add', isAuthenticated, staffController.addStaff);
router.post('/edit', isAuthenticated, staffController.updateStaff);
// Route to delete a staff member
router.post('/delete', isAuthenticated, staffController.deleteStaff);

module.exports = router;