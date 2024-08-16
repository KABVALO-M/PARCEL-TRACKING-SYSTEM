const Branch = require('../models/Branch');
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