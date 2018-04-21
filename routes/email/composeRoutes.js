var router = require("express").Router();

var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/inbox";

// URL: "/compose"
module.exports = function (pool) {

    // "compose.ejs" page
    router.get("/", middleMan.isLoggedIn, (req, res) => res.render("email/compose.ejs"));

    // Create's the email on form post
    router.post("/", middleMan.isLoggedIn, function (req, res) {
        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var sendEmail = require('./queries/sendEmail.sql');

            connection.query(sendEmail, [req.user.id, req.body.title, req.body.content, req.body.receiverUsername], function (err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                var warning = row[1][0];

                // Check if SQL returned a warning code
                if (typeof warning !== 'undefined' && typeof warning.Code !== 'undefined') {

                    // Check's if SQL returned an warnign code of 1048 (can't find)
                    if (flashUtils.errorMessageif(req, res, '/compose', (row[1][0].Code == 1048), "That is not a user!"))
                        return;
                }

                flashUtils.successMessage(req, res, '/inbox', 'Successfully sent the email!');
            });
        });

    });

    return router;
};