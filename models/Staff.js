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
}

module.exports = Staff;
