// config/server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000; // Default to port 3000 if not specified

const sessionSecret = crypto.randomBytes(32).toString('hex');


// Use session middleware
app.use(session({
    secret: sessionSecret, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Use messages middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    delete req.session.successMessage;
    delete req.session.errorMessage;
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Import routes
const authRoutes = require('../routes/auth');
const parcelRoutes = require('../routes/parcel');
const vehicleRoutes = require('../routes/vehicles');
const trackingDevicesRoutes = require('../routes/trackingDevices');
const staffRoutes = require('../routes/staff');
const branchesRoutes = require('../routes/branches');

// Use routes
app.use('/', authRoutes);
app.use('/auth', authRoutes);
app.use('/parcel', parcelRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/tracking-devices', trackingDevicesRoutes);
app.use('/staff', staffRoutes);
app.use('/branches', branchesRoutes);

// 404 Error handling middleware
app.use((req, res) => {
  res.status(404).render('404'); 
});

// Function to start the server
const startServer = async () => {
  try {
    const { success, error } = await require('./database').connect();

    if (success) {
      console.log('Database connected successfully.');
      server_ip = '192.168.143.179'
      app.listen(port, server_ip, () => {
        console.log(`Server is running on http://${server_ip}:${port}`);
      });
    } else {
      console.error('Database connection error:', error);
      console.log('Failed to connect to the database. Please check your configuration.');
      const tempApp = express();
      tempApp.set('view engine', 'ejs');
      tempApp.set('views', path.join(__dirname, '../views'));
      tempApp.use((req, res) => {
        res.status(404).render('404');
      });
      tempApp.listen(port, () => {
        console.log(`Server started in error mode on http://localhost:${port}`);
      });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
};

startServer();
