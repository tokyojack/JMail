var router = require("express").Router();

var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/";

// URL: "/reply"
module.exports = function (pool) {

    // "reply.ejs" page
    router.get("/:id", middleMan.isLoggedIn, function (req, res) {
        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var emailId = parseInt(req.params.id);

            var selectEmailById = require('./queries/selectEmailById.sql');

            connection.query(selectEmailById, [emailId], function (err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                res.render("email/reply.ejs", {
                    emailId: emailId,
                    email: row[0]
                });
            });
        });
    });

    // Submiting reply form
    router.post("/:id", middleMan.isLoggedIn, function (req, res) {
        pool.getConnection(function (err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var emailId = parseInt(req.params.id);

            var replyEmail = require('./queries/replyEmail.sql');

            connection.query(replyEmail, [req.user.id, req.body.content, emailId], function (err, row) {
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

                // Redirect's to the replied email
                flashUtils.successMessage(req, res, '/email/' + emailId, 'Successfully replied to the email!');
            });
        });
        ca
    });

    return router;
};