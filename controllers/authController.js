const db = require('../config/database');
const Staff = require('../models/Staff');
const Vehicle = require('../models/Vehicle');
const Parcel = require('../models/Parcel');
const Branch = require('../models/Branch');

exports.handleRoot = async (req, res) => {
  try {
    const { success, error } = await db.connect();

    if (success) {
      res.redirect('/auth/login');
    } else {
      console.error('Database connection error:', error);
      res.status(404).render('404');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(404).render('404');
  }
};

// Render the login page
exports.loginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard'); 
  }
  res.render('login');
};

// Handle login form submission
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database
    const user = await Staff.findByUsername(username);

    if (!user) {
      req.session.errorMessage = 'Username or password is incorrect.';
      return res.redirect('/auth/login');
    }

    // Verify password
    const isMatch = await Staff.verifyPassword(user.password, password);
    if (!isMatch) {
      req.session.errorMessage = 'Username or password is incorrect.';
      return res.redirect('/auth/login');
    }

    // Successful login
    req.session.user = user;
    req.session.successMessage = 'Login successful!';
    res.redirect('/dashboard');

  } catch (error) {
    console.error('Error during login:', error);
    req.session.errorMessage = 'An error occurred during login.';
    res.redirect('/auth/login');
  }
};

// Render the dashboard
exports.renderDashboard = async (req, res) => {
  try {
    // Retrieve total parcels
    const totalParcels = await Parcel.findAll();
    const sentParcels = await Parcel.findSentParcels();
    const collectedParcels = await Parcel.findCollectedParcels();
    const recentParcels = await Parcel.findRecentParcels(5);
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
      recentParcels: recentParcels,
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.render('dashboard', { user: req.session.user, errorMessage: 'Error loading data' });
  }
};


// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error during logout:', err);
          req.session.errorMessage = 'An error occurred during logout.';
          return res.redirect('/dashboard'); 
      }
      res.redirect('/auth/login');
  });
};
