module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Доступ только для авторизованных пользователей');
        res.redirect('/users/login');
    }
};
