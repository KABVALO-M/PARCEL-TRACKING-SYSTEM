// controllers/parcelController.js
const Parcel = require('../models/Parcel');
const Vehicle = require('../models/Vehicle');
const Branch = require('../models/Branch');
const Staff = require('../models/Staff');
const { generateTrackingNumber } = require('../utils/parcelUtils');

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




// Parcels Sending
// Render the sending page
exports.renderSending = async (req, res) => {
  try {
    // Fetch branches data for the dropdowns
    const branches = await Branch.findAll();
    // Fetch parcels data for the table
    const parcels = await Parcel.findAll();

    res.render('sending', {
      user: req.session.user, // Assuming user data is available
      branches: branches,
      parcels: parcels,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.render('sending', {
      user: req.session.user,
      branches: [],
      parcels: [],
      successMessage: null,
      errorMessage: 'Error fetching data'
    });
  }
};

// Add new parcel
exports.addParcel = async (req, res) => {
  try {
      const { sender_name, sender_phone, recipient_name, recipient_phone, parcel_weight, source, destination, parcel_name, parcel_value, collection_fee, date} = req.body;
      staff_id = req.session.user.staff_id

      // Generate a tracking number (you can implement a custom logic here)
      let tracking_number;
      let tracking_number_exists = true;

      while (tracking_number_exists) {
          tracking_number = generateTrackingNumber();

          const existingParcels = await Parcel.findByTrackingNumber(tracking_number);

          if (!existingParcels) {
            tracking_number_exists = false; 
        }
      }

      // Prepare parcel data
      const parcelData = {
          tracking_number,
          sender_name,
          sender_phone,
          recipient_name,
          recipient_phone,
          parcel_name,
          parcel_value,
          parcel_weight,
          collection_fee,
          collection_date: date,  // Ensure this is not null and is in a correct format
          delivery_date: null,
          origin_branch_id: source,
          destination_branch_id: destination,
          tracking_device_id: null,
          staff_id,  
      };

      // Add the new parcel using the Parcel model
      await Parcel.addNewParcel(parcelData);
      res.json({ success: true });
  } catch (error) {
      console.error('Error adding parcel:', error);
  }
};

exports.getDeliveredParcels = async (req, res) => {
  try {
      const parcels = await Parcel.getDeliveredParcels();
      res.render('delivered', {
          parcels: parcels,
          successMessage: req.session.successMessage || null,
          errorMessage: req.session.errorMessage || null,
          user: req.session.user
      });
  } catch (error) {
      console.error(error);
      req.session.errorMessage = 'Failed to retrieve parcels.';
      res.redirect('/parcel/delivered');
  }
};

