const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/authenticated'); 
 
// Route for '/'
router.get('/', authController.handleRoot);

// Routes for authentication
router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/dashboard', isAuthenticated, authController.renderDashboard);
router.get('/logout', authController.logout);

module.exports = router;
