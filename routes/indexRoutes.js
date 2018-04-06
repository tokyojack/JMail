var router = require("express").Router();

// URL: "/"
module.exports = function () {

    // "index.ejs" page
    router.get("/", (req, res) => res.render("index.ejs"));

    return router;
};