var express = require('express');
var router = express.Router();
const UserModel = require('../models/Users');
const UserError = require("../helpers/error/UserError");
const { registerValidator, loginValidator } = require('../middleware/validation');
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");

/**
* Users Router
* ---------------
* The users router include the actions for registering a new account and logging in/out an existing 
* account. We use the UserModel to utilize the MYSQL queries to execute these actions.
*/

// Registering a new account
// First validate the username, password, confirm password, email (validation.js in middleware folder). 
router.use('/register', registerValidator); 
router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    // Check if the username already exists in the database (should be unique)
    UserModel.usernameExists(username)
        .then((userDoesExist) => {
            if (userDoesExist) {
                req.session.save(err => {
                    res.render("register", {
                        errorMessage: "Registration Failed: Username already exists.",
                        user: username,
                        email: email
                    });
                })
            } else {
                return UserModel.emailExists(email);
            }
        })
        // Check if the email already exists in the database (should be unique)
        .then((emailDoesExist) => {
            if (emailDoesExist) {
                req.session.save(err => {
                    res.render("register", {
                        errorMessage: "Registration Failed: Email already exists.",
                        user: username,
                        email: email
                    });
                })
            } else {
                return UserModel.create(username, password, email);
            }
        })
        .then((createdUserId) => {
            if (createdUserId < 0) {
                throw new UserError(
                    "Server Error, user could not be created.",
                    "/register",
                    500
                );
            } else {
                successPrint("User.js --> User was created!");
                req.session.save(err => {
                    res.render("login", {
                        successMessage: "User account has been made!",
                    });
                })
            }
        })
        .catch((err) => {
            errorPrint("User could not be made.", err);
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        });
});

// Logging in an account
router.use('/login', loginValidator);
router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    // We call UserModel.authenticate to check if username exists and see if password matches.
    UserModel.authenticate(username, password)
        .then((loggedUserId) => {
            if (loggedUserId > 0) {
                successPrint(`User.js --> User ${username} is logged in!`);
                req.session.username = username;
                req.session.userId = loggedUserId;
                res.locals.logged = true;
                req.session.save(success => {
                    res.redirect("/");
                })
            } else {
                req.session.save(err => {
                    res.render("login", {
                        errorMessage: "Invalid username and/or password!"
                    });
                });
            }
        })
        .catch((err) => {
            errorPrint("User login failed.");
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                req.session.save(err => {
                    res.render("login", {
                        errorMessage: "Invalid username and/or password!"
                    });
                });
            } else {
                next(err);
            }
        })
});

// Logging out an account
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint('Session could not be destroyed.');
            next(err);
        } else {
            successPrint('Session was destroyed.');
            res.clearCookie('csid');
            res.json({ status: "OK", message: "User is logged out." });
        }
    })
});

module.exports = router;
