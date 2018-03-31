var flashUtils = require('./../utils/flashUtils');

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport, pool) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        pool.getConnection(function(err, connection) {
            connection.release();

            if (err)
                console.log(err);

            connection.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows) {
                done(err, rows[0]);
            });
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {

                pool.getConnection(function(err, connection) {
                    connection.release();

                    if (flashUtils.isAuthenticationDatabaseError(req, err))
                        return done(err);


                    connection.query("SELECT * FROM users WHERE username=?", [username], function(err, rows) {

                        if (flashUtils.isAuthenticationDatabaseError(req, err))
                            return done(err);

                        //TODO change row.length check?
                        if (flashUtils.authenticationSuccessMessageIf(req, rows.length, 'That username is already taken!'))
                            return done(null, false);

                        var newUser = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)
                        };

                        // TODO Seperate file
                        var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";
                        connection.query(insertQuery, [newUser.username, newUser.password], function(err, rows) {
                            newUser.id = rows.insertId;

                            if (flashUtils.isAuthenticationDatabaseError(req, err))
                                return done(err);

                            return done(null, newUser);
                        });

                    });
                });
            })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {

                pool.getConnection(function(err, connection) {
                    connection.release();

                    if (flashUtils.isAuthenticationDatabaseError(req, err))
                        return done(err);


                    connection.query("SELECT * FROM users WHERE username=?", [username], function(err, rows) {
                        if (flashUtils.isAuthenticationDatabaseError(req, err))
                            return done(err);

                        //Change boolean?
                        if (flashUtils.authenticationSuccessMessageIf(req, !rows.length, 'Some of your details are not correct. Please try again.'))
                            return done(null, false);

                        //Change boolean?
                        if (flashUtils.authenticationSuccessMessageIf(req, (!bcrypt.compareSync(password, rows[0].password)), 'Some of your details are not correct. Please try again.'))
                            return done(null, false);

                        return done(null, rows[0]);
                    });
                });
            })
    );

};
