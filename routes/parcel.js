// routes/panel.js

const express = require('express');
const router = express.Router();
const Parcel = require('../models/Parcel');

// Middleware to ensure user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Dashboard route
// Dashboard route
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    // Retrieve total parcels
    const totalParcels = await Parcel.findAll();
    
    // Retrieve sent parcels (status not 'Pending')
    const sentParcels = await Parcel.findSentParcels();
    
    // Retrieve collected parcels (status 'Collected')
    const collectedParcels = await Parcel.findCollectedParcels();

    // Render the dashboard view with the data
    res.render('dashboard', {
      user: req.session.user,
      totalParcelsCount: totalParcels.length,
      sentParcelsCount: sentParcels.length,
      collectedParcelsCount: collectedParcels.length
    });
  } catch (error) {
    console.error('Error fetching parcel data:', error);
    res.render('dashboard', {
      user: req.session.user,
      totalParcelsCount: 0,
      sentParcelsCount: 0,
      collectedParcelsCount: 0,
      error: 'Error fetching parcel data'
    });
  }
});

module.exports = router;
