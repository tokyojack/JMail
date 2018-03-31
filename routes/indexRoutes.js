var router = require("express").Router();

// URL: "/"
module.exports = function() {
    
    // "index.ejs" page
    router.get("/", function(req, res) {
        res.render("index.ejs");
    });

    return router;
};