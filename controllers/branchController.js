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

// Update Branch Function
exports.updateBranch = async (req, res) => {
  const { id } = req.params; // Get the branch ID from the URL
  const { name, location, contact } = req.body; // Extract data from the request body

  if (!name || !location || !contact) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Call the updateBranch method from the Branch model
    const result = await Branch.updateBranch(id, name, location, contact);
    
    // Send success response
    res.json({ success: true, message: 'Branch updated successfully', result });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Delete Branch Function
exports.deleteBranch = async (req, res) => {
  const { branchId } = req.params; // Get the branch ID from the URL

  try {
    // Call the deleteBranch method from the Branch model
    const result = await Branch.deleteBranch(branchId);
    
    // Send success response
    res.json({ success: true, message: 'Branch deleted successfully', result });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};