var router = require("express").Router();

// URL: "/signup"
module.exports = function(passport) {

    //Signup page
    router.get("/", function(req, res) {
        res.render("authentication/signup.ejs");
    });

    //Sign's up person on form post
    router.post('/', passport.authenticate('local-signup', {
        successRedirect: '/home',
        failureRedirect: '/signup'
    }));

    return router;
};
