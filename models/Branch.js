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
}

module.exports = Branch;
