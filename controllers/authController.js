const Staff = require('../models/Staff');

// Render the login page
exports.loginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/parcel/dashboard'); 
  }
  res.render('login');
};

// Handle login form submission
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database
    const user = await Staff.findByUsername(username);

    if (!user) {
      req.session.errorMessage = 'Username or password is incorrect.';
      return res.redirect('/auth/login');
    }

    // Verify password
    const isMatch = await Staff.verifyPassword(user.password, password);
    if (!isMatch) {
      req.session.errorMessage = 'Username or password is incorrect.';
      return res.redirect('/auth/login');
    }

    // Successful login
    req.session.user = user;
    req.session.successMessage = 'Login successful!';
    res.redirect('/parcel/dashboard');

  } catch (error) {
    console.error('Error during login:', error);
    req.session.errorMessage = 'An error occurred during login.';
    res.redirect('/auth/login');
  }
};

// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error during logout:', err);
          req.session.errorMessage = 'An error occurred during logout.';
          return res.redirect('/dashboard'); 
      }
      res.redirect('/auth/login');
  });
};
