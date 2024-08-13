const db = require('../config/database');

class Parcel {
  static async findAll() {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Parcel');
      return results;
    } catch (error) {
      throw new Error('Error retrieving parcels: ' + error.message);
    }
  }

  static async findById(parcelId) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Parcel WHERE parcel_id = ?', [parcelId]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding parcel by ID: ' + error.message);
    }
  }

  static async findByTrackingNumber(trackingNumber) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Parcel WHERE tracking_number = ?', [trackingNumber]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding parcel by tracking number: ' + error.message);
    }
  }

  // Retrieve parcels where status is not 'Pending'
  static async findSentParcels() {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Parcel WHERE status != ?', ['Pending']);
      return results;
    } catch (error) {
      throw new Error('Error retrieving sent parcels: ' + error.message);
    }
  }

  // Retrieve parcels with status 'Collected'
  static async findCollectedParcels() {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Parcel WHERE status = ?', ['Collected']);
      return results;
    } catch (error) {
      throw new Error('Error retrieving collected parcels: ' + error.message);
    }
  }

  // Add a new parcel
  static async addNewParcel(parcelData) {
    try {
      const { tracking_number, sender_name, sender_phone, recipient_name, recipient_phone, parcel_name, parcel_value, parcel_weight, collection_fee, collection_date, delivery_date, origin_branch_id, destination_branch_id, tracking_device_id, staff_id } = parcelData;

      const [result] = await db.promisePool.query(
        `INSERT INTO Parcel (tracking_number, sender_name, sender_phone, recipient_name, recipient_phone, parcel_name, parcel_value, parcel_weight, collection_fee, collection_date, delivery_date, origin_branch_id, destination_branch_id, status, tracking_device_id, staff_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)`,
        [tracking_number, sender_name, sender_phone, recipient_name, recipient_phone, parcel_name, parcel_value, parcel_weight, collection_fee, collection_date, delivery_date, origin_branch_id, destination_branch_id, tracking_device_id, staff_id]
      );

      console.log('Parcel added successfully:', result);
    } catch (error) {
      console.error('Error adding new parcel:', error);
    }
  }

  // Update parcel status
  static async updateParcelStatus(trackingNumber, newStatus) {
    try {
      const validStatuses = ['Collected', 'In Transit', 'Delivered', 'Pending'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid status');
      }

      const [result] = await db.promisePool.query(
        `UPDATE Parcel SET status = ? WHERE tracking_number = ?`,
        [newStatus, trackingNumber]
      );

      console.log('Parcel status updated successfully:', result);
    } catch (error) {
      console.error('Error updating parcel status:', error);
    }
  }
}



  

module.exports = Parcel;
