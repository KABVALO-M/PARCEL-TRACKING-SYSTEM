const db = require('../config/database');

class Vehicle {
  static async findAll() {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Vehicle');
      return results;
    } catch (error) {
      throw new Error('Error retrieving vehicles: ' + error.message);
    }
  }

  static async findById(vehicleId) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Vehicle WHERE vehicle_id = ?', [vehicleId]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding vehicle by ID: ' + error.message);
    }
  }
}

module.exports = Vehicle;
