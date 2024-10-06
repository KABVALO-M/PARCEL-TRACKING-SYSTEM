const Branch = require('../models/Branch');
const Staff = require('../models/Staff');
const bcrypt = require('bcrypt');

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

exports.updateStaff = async (req, res) => {
    const { staff_id, first_name, last_name, department, branch_id, username } = req.body;
    console.log(department)

    try {
        await Staff.updateStaff(staff_id, first_name, last_name, department, branch_id, username);
        res.redirect('/staff');
    } catch (error) {
        console.error('Error updating staff:', error);
        res.redirect('/staff');
    }
};

exports.deleteStaff = async (req, res) => {
    const { staff_id } = req.body;

    try {
        // Ensure staff ID is provided
        if (!staff_id) {
            return res.status(400).json({ success: false, message: 'Staff ID is required to delete.' });
        }

        // Delete the staff member from the database
        await Staff.deleteStaff(staff_id);
        
        // Set a success message in the session
        req.session.successMessage = 'Staff member deleted successfully.';
        return res.status(200).json({ success: true, message: 'Staff member deleted successfully!' });
    } catch (error) {
        console.error('Error deleting staff member:', error);
        return res.status(500).json({ success: false, message: 'Error deleting staff member.' });
    }
};