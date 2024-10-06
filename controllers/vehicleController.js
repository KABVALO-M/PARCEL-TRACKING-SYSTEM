const Vehicle = require('../models/Vehicle');
const TrackingDevice = require('../models/TrackingDevice');

// Fetch all vehicles and tracking devices for the view
exports.getVehicles = async (req, res) => {
    try {
      const vehicles = await Vehicle.findAll();
      const devices = await TrackingDevice.findAll();
      res.render('vehicles', {
        vehicles,
        devices,
        successMessage: req.session.successMessage || null,
        errorMessage: req.session.errorMessage || null,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.session.errorMessage = 'Failed to retrieve vehicles.';
      res.redirect('/vehicles');
    }
  };
  
  exports.addVehicle = async (req, res) => {
    try {
      const { vehicle_name, vehicle_registration_number, tracking_device_id } = req.body;
      await Vehicle.create({ vehicle_name, vehicle_registration_number, tracking_device_id });
      req.session.successMessage = 'Vehicle added successfully.';
      res.redirect('/vehicles');
    } catch (error) {
      console.error(error);
      req.session.errorMessage = 'Failed to add vehicle.';
      res.redirect('/vehicles');
    }
  };

  // Update a vehicle
exports.updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { vehicle_name, vehicle_registration_number, tracking_device_id } = req.body;

  try {
    const result = await Vehicle.update(id, { vehicle_name, vehicle_registration_number, tracking_device_id });
    if (result) {
      res.json({ success: true, message: 'Vehicle updated successfully' });
    } else {
      res.status(404).json({ error: 'Vehicle not found or no changes were made' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  const vehicleId = req.params.id; // Get vehicle ID from request parameters
  try {
      const deletedCount = await Vehicle.delete(vehicleId);
      
      // Check if a vehicle was deleted
      if (deletedCount > 0) {
          return res.status(200).json({ message: 'Vehicle deleted successfully.' });
      } else {
          return res.status(404).json({ message: 'Vehicle not found.' });
      }
  } catch (error) {
      console.error('Error deleting vehicle:', error);
      return res.status(500).json({ message: 'An error occurred while deleting the vehicle.' });
  }
};