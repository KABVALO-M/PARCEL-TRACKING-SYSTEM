// controllers/parcelController.js
const Parcel = require('../models/Parcel');
const Vehicle = require('../models/Vehicle');
const Branch = require('../models/Branch');
const Staff = require('../models/Staff');

// Render the dashboard
exports.renderDashboard = async (req, res) => {
  try {
    // Retrieve total parcels
    const totalParcels = await Parcel.findAll();
    const sentParcels = await Parcel.findSentParcels();
    const collectedParcels = await Parcel.findCollectedParcels();
    const vehicles = await Vehicle.findAll();
    const branches = await Branch.findAll();
    const staffMembers = await Staff.findAll();

    // Render the dashboard view with the data
    res.render('dashboard', {
      user: req.session.user,
      totalParcelsCount: totalParcels.length,
      sentParcelsCount: sentParcels.length,
      collectedParcelsCount: collectedParcels.length,
      totalVehicles: vehicles.length,
      totalBranches: branches.length,
      totalStaffMembers: staffMembers.length,
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.render('dashboard', { user: req.session.user, errorMessage: 'Error loading data' });
  }
};

// Render the branches page
exports.renderBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll();
    res.render('branches', {
      user: req.session.user,
      branches: branches,
    });
  } catch (error) {
    console.error('Error rendering branches:', error);
    res.render('branches', { user: req.session.user, errorMessage: 'Error loading branches data' });
  }
};
