const db = require('../config/database');

class Parcel {
  static async findAll() {
    try {
      const query = `
        SELECT 
          p.*, 
          origin.branch_name AS origin_branch_name, 
          origin.location AS origin_branch_location, 
          destination.branch_name AS destination_branch_name, 
          destination.location AS destination_branch_location
        FROM 
          Parcel p
        LEFT JOIN 
          Branch origin ON p.origin_branch_id = origin.branch_id
        LEFT JOIN 
          Branch destination ON p.destination_branch_id = destination.branch_id
      `;
      const [results] = await db.promisePool.query(query);
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
      return { success: true };
    } catch (error) {
      console.error('Error adding new parcel:', error);
      return { success: false, error: error.message };
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

   // Function to get delivered parcels
  static async getDeliveredParcels() {
    try {
      const query = `
        SELECT 
          p.*, 
          origin.branch_name AS origin_branch_name, 
          origin.location AS origin_branch_location, 
          destination.branch_name AS destination_branch_name, 
          destination.location AS destination_branch_location
        FROM 
          Parcel p
        LEFT JOIN 
          Branch origin ON p.origin_branch_id = origin.branch_id
        LEFT JOIN 
          Branch destination ON p.destination_branch_id = destination.branch_id
        WHERE p.status = 'Delivered'
      `;
      const [rows] = await db.promisePool.query(query);
      return rows;
    } catch (error) {
      throw new Error('Error fetching delivered parcels: ' + error.message);
    }
  }

  // Add this method to the Parcel model
static async updateParcel(parcelData) {
  try {
      const { 
          parcel_id,
          sender_name, 
          sender_phone, 
          recipient_name, 
          recipient_phone, 
          parcel_name, 
          parcel_value, 
          parcel_weight, 
          collection_fee, 
          collection_date, 
          delivery_date, 
          origin_branch_id, 
          destination_branch_id, 
          tracking_device_id, 
           
      } = parcelData;

      const [result] = await db.promisePool.query(
          `UPDATE Parcel SET 
              sender_name = ?, 
              sender_phone = ?, 
              recipient_name = ?, 
              recipient_phone = ?, 
              parcel_name = ?, 
              parcel_value = ?, 
              parcel_weight = ?, 
              collection_fee = ?, 
              collection_date = ?, 
              delivery_date = ?, 
              origin_branch_id = ?, 
              destination_branch_id = ?, 
              tracking_device_id = ? 
          WHERE parcel_id = ?`,
          [
              sender_name, 
              sender_phone, 
              recipient_name, 
              recipient_phone, 
              parcel_name, 
              parcel_value, 
              parcel_weight, 
              collection_fee, 
              collection_date, 
              delivery_date, 
              origin_branch_id, 
              destination_branch_id, 
              tracking_device_id,
              parcel_id 
          ]
      );

      return { success: true };
  } catch (error) {
      console.error('Error updating parcel:', error);
      return { success: false, error: error.message };
  }
}

  static async getParcelsWithBranches() {
    try {
        const query = `
            SELECT 
                p.*, 
                origin.branch_name AS origin_branch_name, 
                origin.location AS origin_branch_location, 
                destination.branch_name AS destination_branch_name, 
                destination.location AS destination_branch_location
            FROM 
                Parcel p
            LEFT JOIN 
                Branch origin ON p.origin_branch_id = origin.branch_id
            LEFT JOIN 
                Branch destination ON p.destination_branch_id = destination.branch_id
            WHERE 
                p.status = 'Pending'
        `;
        const [results] = await db.promisePool.query(query);
        return results;
    } catch (error) {
        throw new Error('Error retrieving parcels with branches: ' + error.message);
    }
  }


  static async assignTrackingNumber(parcel_id, tracking_device_id) {
      try {
          await db.promisePool.query(`
              UPDATE Parcel 
              SET tracking_device_id = ?, status = 'In Transit'
              WHERE parcel_id = ?
          `, [tracking_device_id, parcel_id]);
      } catch (error) {
          throw new Error('Error assigning tracking number to parcel: ' + error.message);
      }
  }

  static async findRecentParcels(limit) {
      try {
        const query = `
          SELECT 
            p.*, 
            origin.branch_name AS origin_branch_name, 
            destination.branch_name AS destination_branch_name
          FROM 
            Parcel p
          LEFT JOIN 
            Branch origin ON p.origin_branch_id = origin.branch_id
          LEFT JOIN 
            Branch destination ON p.destination_branch_id = destination.branch_id
          ORDER BY 
            p.collection_date DESC
          LIMIT ?
        `;
        const [results] = await db.promisePool.query(query, [limit]);
        return results;
      } catch (error) {
        throw new Error('Error retrieving recent parcels: ' + error.message);
      }
    }

    static async deleteParcelById(parcelId) {
      try {
        const [result] = await db.promisePool.query('DELETE FROM Parcel WHERE parcel_id = ?', [parcelId]);
        
        if (result.affectedRows === 0) {
          return { success: false, error: 'No parcel found with the given ID' };
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error deleting parcel:', error);
        return { success: false, error: error.message };
      }
    }
}


module.exports = Parcel;
