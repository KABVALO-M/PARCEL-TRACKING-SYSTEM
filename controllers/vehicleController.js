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