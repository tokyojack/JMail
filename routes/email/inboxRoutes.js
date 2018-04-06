var router = require("express").Router();

var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/";

// URL: "/inbox"
module.exports = function(pool) {

    // "inbox.ejs" page
    router.get("/", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var selectEmails = require('./queries/selectEmails.sql');

            connection.query(selectEmails, [req.user.id], function(err, rows) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

                res.render("email/inbox.ejs", {
                    emails: rows
                });

            });
        });
    });

    return router;
};
