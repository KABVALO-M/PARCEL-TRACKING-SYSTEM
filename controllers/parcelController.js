// controllers/parcelController.js
const Parcel = require('../models/Parcel');
const Vehicle = require('../models/Vehicle');
const Branch = require('../models/Branch');
const Staff = require('../models/Staff');
const bcrypt = require('bcrypt');

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


// Add a new branch
exports.addBranch = async (req, res) => {
  const { name, location, contact } = req.body;

  // Validate the inputs
  if (!name || !location || !contact) {
      return res.json({ success: false, message: 'All fields are required.' });
  }

  try {
      // Call the model's method to insert the branch
      await Branch.addBranch(name, location, contact);
      return res.json({ success: true, message: 'Branch added successfully.' });
  } catch (error) {
      console.error('Error inserting branch:', error);
      return res.json({ success: false, message: 'Database error occurred.' });
  }
};



// STAFF
// Render the staff page
exports.renderStaff = async (req, res) => {
    try {
        const staffMembers = await Staff.findAll();
        const branches = await Branch.findAll();
        res.render('staff', {
            user: req.session.user,
            staffMembers: staffMembers,
            branches: branches,
            successMessage: req.session.successMessage || null,
            errorMessage: req.session.errorMessage || null
        });
        // Clear messages after rendering
        req.session.successMessage = null;
        req.session.errorMessage = null;
    } catch (error) {
        console.error('Error rendering staff:', error);
        res.render('staff', {
            user: req.session.user,
            errorMessage: 'Error loading staff data'
        });
    }
};

// Handle adding new staff
exports.addStaff = async (req, res) => {
    const { first_name, last_name, department, branch_id, username, password } = req.body;

    if (!first_name || !last_name || !department || !username || !password) {
        return res.json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        await Staff.addStaff(first_name, last_name, department, branch_id, username, hashedPassword);
        req.session.successMessage = 'Staff member added successfully.';
        return res.json({ success: true });
    } catch (error) {
        console.error('Error adding staff:', error);
        return res.json({ success: false, message: 'Database error occurred.' });
    }
};


// Add a new staff member
exports.addStaff = async (req, res) => {
  const { first_name, last_name, department, branch, username, password, confirmPassword } = req.body;

  // Validate password
  if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match!' });
  }

  try {
      // Check if username already exists
      const existingStaff = await Staff.findByUsername(username);
      if (existingStaff) {
          return res.status(400).json({ message: 'Username already exists!' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Add staff member
      await Staff.addStaff(first_name, last_name, department, branch, username, hashedPassword);

      res.status(200).json({ message: 'Staff member added successfully!' });
  } catch (error) {
      console.error('Error adding staff member:', error);
      res.status(500).json({ message: 'Error adding staff member.' });
  }
};

