// models/Vehicle.js
const db = require('../config/database');

class Vehicle {
  static async findAll() {
    try {
      const [results] = await db.promisePool.query(`
        SELECT v.*, td.device_name AS tracking_device_name 
        FROM Vehicle v 
        LEFT JOIN TrackingDevice td ON v.tracking_device_id = td.tracking_device_id
      `);
      return results;
    } catch (error) {
      throw new Error('Error retrieving vehicles: ' + error.message);
    }
  }

  static async create({ vehicle_name, vehicle_registration_number, tracking_device_id }) {
    try {
      const [result] = await db.promisePool.query(`
        INSERT INTO Vehicle (vehicle_name, vehicle_registration_number, tracking_device_id)
        VALUES (?, ?, ?)
      `, [vehicle_name, vehicle_registration_number, tracking_device_id]);
      return result.insertId;
    } catch (error) {
      throw new Error('Error adding vehicle: ' + error.message);
    }
  }
  
  static async findById(vehicle_id) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Vehicle WHERE vehicle_id = ?', [vehicle_id]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding vehicle by ID: ' + error.message);
    }
  }

   // Update a vehicle by ID
   static async update(vehicle_id, { vehicle_name, vehicle_registration_number, tracking_device_id }) {
    try {
      const [result] = await db.promisePool.query(`
        UPDATE Vehicle 
        SET vehicle_name = ?, vehicle_registration_number = ?, tracking_device_id = ?
        WHERE vehicle_id = ?
      `, [vehicle_name, vehicle_registration_number, tracking_device_id, vehicle_id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error('Error updating vehicle: ' + error.message);
    }
  }

  // Delete a vehicle by ID
  static async delete(vehicle_id) {
    try {
      const [result] = await db.promisePool.query('DELETE FROM Vehicle WHERE vehicle_id = ?', [vehicle_id]);
      return result.affectedRows; // Return the number of affected rows (should be 1 if successful)
    } catch (error) {
      throw new Error('Error deleting vehicle: ' + error.message);
    }
  }
}

module.exports = Vehicle;
