const db = require('../config/database');

class TrackingDevice {
  static async findAll() {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM TrackingDevice');
      return results;
    } catch (error) {
      throw new Error('Error retrieving tracking devices: ' + error.message);
    }
  }

  static async findById(trackingDeviceId) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM TrackingDevice WHERE tracking_device_id = ?', [trackingDeviceId]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding tracking device by ID: ' + error.message);
    }
  }
}

module.exports = TrackingDevice;
