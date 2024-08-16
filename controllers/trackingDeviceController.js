const TrackingDevice = require('../models/TrackingDevice');
// Tracking devices
// Method to get all tracking devices
exports.getTrackingDevices = async (req, res) => {
    try {
      const devices = await TrackingDevice.findAll(); // Use the model method
      res.render('trackingDevices', {
        devices: devices,
        successMessage: req.session.successMessage || null,
        errorMessage: req.session.errorMessage || null,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.session.errorMessage = 'Failed to retrieve tracking devices.';
      res.redirect('/devices');
    }
  };
  
  // Save Tracking Device
  exports.addTrackingDevice = async (req, res) => {
    const { device_name, device_type, status } = req.body;
    
    try {
      await TrackingDevice.addDevice({ device_name, device_type, status });
      req.session.successMessage = 'Tracking device added successfully.';
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      req.session.errorMessage = 'Failed to add tracking device.';
      res.redirect('/devices');
    }
  };
  
  
  