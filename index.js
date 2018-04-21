//============================= Packages =============================

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var colors = require('colors');

//============================= Pool =============================

var config = require('./config/config');
var mysql = require("mysql");
var pool = mysql.createPool(config.db);

exports.pool = pool;

require('require-sql');

//============================= Passport =============================

var passport = require('passport');
require('./config/passport')(passport, pool);

//============================= Letting express use them =============================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.use(flash());

app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({
    secret: 'RANDOM',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    res.locals.user = req.user;

    next();
});

//============================= Routes =============================

//Index

var indexRoutes = require("./routes/indexRoutes")();
app.use("/", indexRoutes);

// Email

var inboxRoutes = require("./routes/email/inboxRoutes")(pool);
app.use("/inbox", inboxRoutes);

var composeRoutes = require("./routes/email/composeRoutes")(pool);
app.use("/compose", composeRoutes);

var emailRoutes = require("./routes/email/emailRoutes")(pool);
app.use("/email", emailRoutes);

var deleteRoutes = require("./routes/email/deleteRoutes")(pool);
app.use("/delete", deleteRoutes);

var forwardRoutes = require("./routes/email/forwardRoutes")(pool);
app.use("/forward", forwardRoutes);

var replyRoutes = require("./routes/email/replyRoutes")(pool);
app.use("/reply", replyRoutes);

// Authentication

var loginRoutes = require("./routes/authentication/loginRoutes")(passport);
app.use("/login", loginRoutes);

var signupRoutes = require("./routes/authentication/signupRoutes")(passport);
app.use("/signup", signupRoutes);

var logoutRoutes = require("./routes/authentication/logoutRoutes")();
app.use("/logout", logoutRoutes);

// Misc

var miscRoutes = require("./routes/misc/miscRoutes")();
app.use("*", miscRoutes);

//============================= Starting Server =============================

app.listen(8080, function() {
    console.log("Server running".rainbow);
});

//============================= Ending Server =============================

require('./utils/nodeEnding').nodeEndingCode(nodeEndInstance);

function nodeEndInstance() {
    console.log("The pool has been closed.".bgBlack.blue);
    pool.end();
}
