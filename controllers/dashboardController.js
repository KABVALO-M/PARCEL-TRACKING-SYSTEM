// controllers/dashboardController.js

exports.renderDashboard = (req, res) => {
    if (!req.session.user) {
        req.session.errorMessage = 'Please log in to access the dashboard';
        return res.redirect('/');
    }
    res.render('dashboard', { user: req.session.user });
};
