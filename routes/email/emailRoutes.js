var router = require("express").Router();

var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/";

// URL: "/email"
module.exports = function (pool) {

    // "email.ejs" page
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


                var replies = row[0].replies;

                var repliesNew = [];

                if (replies != null) {

                    var repliesSpl = replies.split(",");

                    if (repliesSpl.length <= 0) {
                        var repliesValueSplit = replies.split("_");
                        repliesNew.push({
                            name: repliesValueSplit[0],
                            content: repliesValueSplit[1]
                        });
                    } else {
                        for (var i = 0; i < repliesSpl.length; i++) {
                            var repliesValueSplit = repliesSpl[i].split("_");
                            repliesNew.push({
                                name: repliesValueSplit[0],
                                content: repliesValueSplit[1]
                            });
                        }
                    }
                }

                res.render("email/email.ejs", {
                    emailId: emailId,
                    email: row[0],
                    replies: repliesNew
                });
            });
        });
    });

    return router;
};