const db = require('../config/database');

class ParcelRequestLog {
  static async findAll() {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM ParcelRequestLog');
      return results;
    } catch (error) {
      throw new Error('Error retrieving parcel request logs: ' + error.message);
    }
  }

  static async findById(requestId) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM ParcelRequestLog WHERE request_id = ?', [requestId]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding request log by ID: ' + error.message);
    }
  }

  static async findByTrackingNumber(trackingNumber) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM ParcelRequestLog WHERE tracking_number = ?', [trackingNumber]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding request log by tracking number: ' + error.message);
    }
  }
}

module.exports = ParcelRequestLog;
