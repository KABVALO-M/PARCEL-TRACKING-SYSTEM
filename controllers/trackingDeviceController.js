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
  
// Edit device controller
exports.editDevice = async (req, res) => {
  try {
      const { device_name, device_type, status } = req.body; // Destructure the form fields
      const { deviceId } = req.params; // Get the device ID from the URL

      // Validation (basic validation, you can expand this)
      if (!device_name || !device_type || !status) {
          return res.status(400).json({ success: false, error: 'All fields are required.' });
      }

      // Update the tracking device in the database
      await TrackingDevice.updateDevice(deviceId, {
          device_name,
          device_type,
          status
      });

      // Return success response
      return res.status(200).json({ success: true, message: 'Device updated successfully.' });
  } catch (error) {
      console.error('Error updating device:', error);
      return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

exports.deleteTrackingDevice = async (req, res) => {
  const deviceId = req.params.id; // Get device ID from the request parameters

  try {
      await TrackingDevice.deleteDevice(deviceId);
      return res.json({ success: true, message: 'Tracking device deleted successfully.' });
  } catch (error) {
      console.error('Error deleting tracking device:', error);
      return res.status(500).json({ success: false, message: error.message });
  }
};