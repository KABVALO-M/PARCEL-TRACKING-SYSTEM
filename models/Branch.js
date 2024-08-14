const db = require('../config/database');

class Branch {
  static async findAll() {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Branch');
      return results;
    } catch (error) {
      throw new Error('Error retrieving branches: ' + error.message);
    }
  }

  static async findById(branchId) {
    try {
      const [results] = await db.promisePool.query('SELECT * FROM Branch WHERE branch_id = ?', [branchId]);
      return results[0] || null;
    } catch (error) {
      throw new Error('Error finding branch by ID: ' + error.message);
    }
  }

  static async addBranch(name, location, contact) {
    try {
      const query = 'INSERT INTO Branch (branch_name, location, contact) VALUES (?, ?, ?)';
      const values = [name, location, contact];
      await db.promisePool.query(query, values);
      return { success: true };
    } catch (error) {
      throw new Error('Error inserting branch: ' + error.message);
    }
  }
}

module.exports = Branch;
