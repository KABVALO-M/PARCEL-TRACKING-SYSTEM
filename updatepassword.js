const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Database connection
async function updatePassword() {
  const db = await mysql.createConnection({
    host: 'localhost',        // Your database host
    user: 'root',     // Your database user
    password: '', // Your database password
    database: 'parcel_tracking_system'  // Your database name
  });

  try {
    // Password to hash
    const plainPassword = 'Password@123';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Update the password in the database for the specific user
    await db.execute('UPDATE Staff SET password = ? WHERE staff_id = ?', [hashedPassword, 1]);

    console.log('Password has been updated successfully.');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await db.end();
  }
}

updatePassword();
