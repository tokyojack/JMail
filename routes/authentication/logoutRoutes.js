var router = require("express").Router();
var flashUtils = require('../../utils/flashUtils');

// URL: "/logout"
module.exports = function() {

    // Logout's the person
    router.get('/', function(req, res) {
        req.logout();
        flashUtils.successMessage(req, res, '/', 'You have logged out');
    });

    return router;
};
