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

  static async addDevice({ device_name, device_type, status }) {
    try {
      const query = 'INSERT INTO TrackingDevice (device_name, device_type, status) VALUES (?, ?, ?)';
      await db.promisePool.query(query, [device_name, device_type, status]);
    } catch (error) {
      throw new Error('Error creating tracking device: ' + error.message);
    }
  }

   // Update an existing tracking device by ID
   static async updateDevice(trackingDeviceId, { device_name, device_type, status }) {
    try {
      const query = `
        UPDATE TrackingDevice
        SET device_name = ?, device_type = ?, status = ?
        WHERE tracking_device_id = ?
      `;
      const [result] = await db.promisePool.query(query, [device_name, device_type, status, trackingDeviceId]);

      if (result.affectedRows === 0) {
        throw new Error('No device found with the given ID');
      }
    } catch (error) {
      throw new Error('Error updating tracking device: ' + error.message);
    }
  }

  static async deleteDevice(trackingDeviceId) {
    try {
      const [result] = await db.promisePool.query('DELETE FROM TrackingDevice WHERE tracking_device_id = ?', [trackingDeviceId]);

      if (result.affectedRows === 0) {
        throw new Error('No device found with the given ID to delete');
      }
    } catch (error) {
      throw new Error('Error deleting tracking device: ' + error.message);
    }
  }
}

module.exports = TrackingDevice;
