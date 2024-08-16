const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const isAuthenticated = require('../middleware/authenticated'); 

// Branches route
router.get('/', isAuthenticated, branchController.renderBranches);
// Route to handle adding a new branch
router.post('/add', isAuthenticated, branchController.addBranch);

module.exports = router;