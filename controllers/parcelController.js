// controllers/parcelController.js
const Parcel = require('../models/Parcel');
const Branch = require('../models/Branch');
const Vehicle = require('../models/Vehicle');
const { generateTrackingNumber } = require('../utils/parcelUtils');
const {sendParcelDetailsSms, sendLocationSms, registerWebhook, deregisterWebhook } = require('../utils/smsUtils');
const { getLocationName } = require('../utils/gpsUtils'); // Import the getLocationName function

// Render the sending page
exports.renderSending = async (req, res) => {
  try {
    // Fetch branches data for the dropdowns
    const branches = await Branch.findAll();
    // Fetch parcels data for the table (can show recent parcels or all)
    const parcels = await Parcel.findAll();

    res.render('sending', {
      user: req.session.user,  // Assuming the session user is available
      branches: branches,      // List of all branches for dropdown selection
      parcels: parcels,        // List of parcels to display in the table
    });
  } catch (error) {
    console.error('Error fetching data for sending page:', error);
    res.render('sending', {
      user: req.session.user,  // Preserve user data if possible
      branches: [],            // Empty array if fetching branches fails
      parcels: [],             // Empty array if fetching parcels fails
      successMessage: null,
      errorMessage: 'Error fetching data for the sending form'
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
      // Send SMS notification to the recipient and sender
      const sourceBranch = await Branch.findById(source);
      const destinationBranch = await Branch.findById(destination);
      console.log(sourceBranch, destinationBranch);
      await sendParcelDetailsSms(tracking_number, sender_name, recipient_name, recipient_phone, parcel_name, sourceBranch.district, destinationBranch.district, 'Pending', date);
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


// Handle SMS Reception
exports.handleSmsReceived = async (req, res) => {
  try {
      const from = req.body.payload.phoneNumber;
      const message = req.body.payload.message;

      // Assuming the message is in the format "LOCATION: <tracking_number>"
      if (message.startsWith('LOCATION:')) {
          const trackingNumber = message.split('LOCATION:')[1].trim();

          // Retrieve location name based on tracking number
          const locationName = await getLocationName(trackingNumber);
          console.log(locationName);

          // Send response SMS with location name
          await sendLocationSms(from, locationName);

          return res.sendStatus(200); // Respond with 200 OK
      } else {
          return res.sendStatus(400); // Bad request if message format is incorrect
      }
  } catch (error) {
      console.error('Error handling SMS:', error);
      return res.sendStatus(500); // Internal server error
  }
};

// Update parcel information
// Update the updateParcel method in your parcelController.js
exports.updateParcel = async (req, res) => {
  try {
      const parcelId = req.params.parcelId; // Get the parcel ID from the URL parameters

      // Capture data from the request body
      const { 
          sender_name, 
          sender_phone, 
          recipient_name, 
          recipient_phone, 
          parcel_weight, 
          source: origin_branch_id, // Map the source to origin_branch_id
          destination: destination_branch_id, // Map the destination to destination_branch_id
          parcel_name, 
          parcel_value, 
          collection_fee, 
          date: delivery_date // Use the date for delivery_date
      } = req.body;

      // Prepare the parcel data object
      const parcelData = {
          parcel_id: parcelId, // Ensure the ID is included
          sender_name,
          sender_phone,
          recipient_name,
          recipient_phone,
          parcel_weight,
          origin_branch_id,
          destination_branch_id,
          parcel_name,
          parcel_value,
          collection_fee,
          delivery_date
      };

      // Call the model method to update the parcel
      const updateResult = await Parcel.updateParcel(parcelData);

      if (updateResult.success) {
          res.json({ success: true, message: 'Parcel updated successfully.' });
      } else {
          res.status(500).json({ success: false, message: updateResult.error });
      }
  } catch (error) {
      console.error('Error updating parcel:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Controller for rendering the Assign Parcels page
exports.assignParcelsPage = async (req, res) => {
  try {
    // Get parcels with origin and destination branches
    const availableParcels = await Parcel.getParcelsWithBranches();

    // Use a Set to store unique routes (origin-destination pairs)
    const uniqueRoutes = new Set();

    availableParcels.forEach(parcel => {
      const routeKey = `${parcel.origin_branch_id}-${parcel.destination_branch_id}`;
      uniqueRoutes.add(routeKey);
    });

    // Convert the Set back to an array for rendering
    const routesArray = Array.from(uniqueRoutes).map(route => {
      const [originBranchId, destinationBranchId] = route.split('-');
      const originParcel = availableParcels.find(p => p.origin_branch_id === parseInt(originBranchId));
      const destinationParcel = availableParcels.find(p => p.destination_branch_id === parseInt(destinationBranchId));

      return {
        originBranchId,
        destinationBranchId,
        originBranchName: originParcel ? originParcel.origin_branch_name : 'Unknown Origin',
        destinationBranchName: destinationParcel ? destinationParcel.destination_branch_name : 'Unknown Destination'
      };
    });

    // Get available vehicles
    const availableVehicles = await Vehicle.findAll();

    // Render the page, passing unique routes and vehicles
    res.render('assignParcels', {
      routes: routesArray,  // Pass the unique routes instead of all parcels
      vehicles: availableVehicles,
      availableParcels: availableParcels,
    });
  } catch (error) {
    console.error('Error rendering Assign Parcels page:', error);
    res.status(500).send('An error occurred while rendering the page.');
  }
};

exports.assignParcels = async (req, res) => {
  try {
    // Get the data sent from the client
    const { branchRoute, vehicleId, parcels } = req.body;

    // Log the received data to the console
    console.log('Branch Route:', branchRoute);
    console.log('Vehicle ID:', vehicleId);
    console.log('Parcels:', parcels);

    // Retrieve the vehicle information using the vehicle ID
    const vehicle = await Vehicle.findById(vehicleId);

    // Check if the vehicle was found
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Loop through each parcel and assign the tracking number based on the vehicle's tracking device ID
    for (const parcel of parcels) {
      // Assign the tracking number for the parcel
      await Parcel.assignTrackingNumber(parcel.parcel_id, vehicle.tracking_device_id);
      console.log('Parcel Updated')
    }

    // Log the updated parcels
    console.log('Assigned Vehicle:', vehicle);
    console.log('Updated Parcels:', parcels);

    res.json({
      message: 'Parcels assigned and tracking numbers updated successfully',
      assignedParcels: parcels,
      assignedVehicle: vehicle
    });
  } catch (error) {
    console.error('Error assigning parcels:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteParcel = async (req, res) => {
  try {
    const parcelId = req.params.parcelId;

    // Call the model method to delete the parcel by its ID
    const deleteResult = await Parcel.deleteParcelById(parcelId);

    if (deleteResult.success) {
      return res.status(200).json({ success: true, message: 'Parcel deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: deleteResult.error });
    }
  } catch (error) {
    console.error('Error deleting parcel:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
