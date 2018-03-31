var flashUtils = require('./flashUtils');

exports.isLoggedIn = function(req, res, next) {
    if (!(isLoggedIn(req, res)))
        return;

    return next();
};

function isLoggedIn(req, res) {
    if (req.isAuthenticated())
        return true;

    req.flash("error", "You must be logged in todo that.");
    res.redirect("/login");
    return false;
}
