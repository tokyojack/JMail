var router = require("express").Router();

var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/";

// URL: "/email"
module.exports = function(pool) {

    // "email.ejs" page
    router.get("/:id", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var emailId = parseInt(req.params.id);

            var selectEmailById = require('./queries/selectEmailById.sql');

            connection.query(selectEmailById, [emailId], function(err, row) {
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

    // "compose.ejs" page post
    router.post("/:id", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var emailId = parseInt(req.params.id);

            var replyEmail = require('./queries/replyEmail.sql');

            connection.query(replyEmail, [req.user.id, req.body.content, emailId], function(err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                var warning = row[1][0];

                if (typeof warning !== 'undefined' && typeof warning.Code !== 'undefined') {
                    if (row[1][0].Code == 1048) {
                        flashUtils.errorMessage(req, res, '/compose', "That is not a user!");
                        return;
                    }
                }


                flashUtils.successMessage(req, res, '/email/' + emailId, 'Successfully replied to the email!');
            });
        });

    });

    return router;
};
