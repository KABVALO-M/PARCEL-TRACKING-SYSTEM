// routes/index.js

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Route for '/'
router.get('/', async (req, res) => {
  try {
    const { success, error } = await db.connect();

    if (success) {
      res.redirect('auth/login');
    } else {
      console.error('Database connection error:', error);
      res.status(404).render('404');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(404).render('404');
  }
});

module.exports = router;
