const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'parcel_tracking_system',
});

const promisePool = pool.promise();

module.exports = {
  connect: async () => {
    try {
      await promisePool.getConnection();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },
  promisePool,
};
