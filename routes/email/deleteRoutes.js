var router = require("express").Router();

var middleMan = require("../../utils/middleMan");
var flashUtils = require('../../utils/flashUtils');

var redirectLocation = "/inbox";

// URL: "/delete"
module.exports = function(pool) {

     // Delete's email from post
    router.get("/:id", middleMan.isLoggedIn, function(req, res) {
        pool.getConnection(function(err, connection) {
            if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                return;

            var deleteEmailFromId = require('./queries/deleteEmailFromId.sql');

            connection.query(deleteEmailFromId, [parseInt(req.params.id)], function(err, row) {
                connection.release();

                if (flashUtils.isDatabaseError(req, res, redirectLocation, err))
                    return;

               flashUtils.successMessage(req, res, '/inbox', "The email was successfully deleted");
            });
        });

    });

    return router;
};
