const db = require('../config/database');
const bcrypt = require('bcrypt');

class Staff {
  static async findByUsername(username) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Staff WHERE username = ?', [username]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding staff by username: ' + error.message);
    }
  }

  static async verifyPassword(storedPassword, inputPassword) {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error) {
      throw new Error('Error verifying password: ' + error.message);
    }
  }

  static async findAll() {
    try {
      const query = `
        SELECT s.staff_id, s.first_name, s.last_name, s.department, b.branch_name AS branch_name, s.username
        FROM Staff s
        LEFT JOIN Branch b ON s.branch_id = b.branch_id;
      `;
      const [results] = await db.promisePool.query(query);
      return results;
    } catch (error) {
      throw new Error('Error retrieving staff members: ' + error.message);
    }
  }

  static async addStaff(first_name, last_name, department, branch_id, username, password) {
    try {
      await db.promisePool.query(
        'INSERT INTO Staff (first_name, last_name, department, branch_id, username, password) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, department, branch_id, username, password]
      );
    } catch (error) {
      throw new Error('Error adding staff member: ' + error.message);
    }
  }

  // Method to update staff member details
  static async updateStaff(staff_id, first_name, last_name, department, branch_id, username) {
    try {
      const query = `
        UPDATE Staff
        SET first_name = ?, last_name = ?, department = ?, branch_id = ?, username = ?
        WHERE staff_id = ?;
      `;
      await db.promisePool.query(query, [first_name, last_name, department, branch_id, username, staff_id]);
    } catch (error) {
      throw new Error('Error updating staff member: ' + error.message);
    }
  }

  static async deleteStaff(staff_id) {
    try {
      await db.promisePool.query('DELETE FROM Staff WHERE staff_id = ?', [staff_id]);
    } catch (error) {
      throw new Error('Error deleting staff member: ' + error.message);
    }
  }
}



module.exports = Staff;
