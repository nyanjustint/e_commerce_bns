var db = require('../config/database');
var bcrypt = require('bcrypt');
const { userIsLoggedIn } = require('./routeprotectors');

/**
* Validation
* -----------
* There is a validator for both login and registration. We want to validate what the user has
* submitted in the form. For registration, we want to make sure the username is at least 3 alpha-
* numeric characters, password should be at least 8 characters, confirm password and password should
* be the same and the email must have sfsu.edu at the end. For login validation, we want to check
* if the user exists. If the user exists in the database, it will check if the password matches
* the one in the database. If matched, user will successfully login, else it will return an error.
*
* The validations are used in users.js in routes folder. 
*/

const checkUsername = (username) => {
    /**
     * Regex Explanation
     * \w   --> anything that is a alphanumeric character [a-zA-Z0-9] 
     * {3,} --> 3 or more characters w/ NO UPPER LIMIT
     */
    let usernameChecker = /\w{3,}$/;
    return usernameChecker.test(username);
}

const checkPassword = (password) => {
    if (password.length < 8) {
        return false;
    } else {
        return true;
    }
}

const checkEmail = (email) => {
    let emailChecker = /\S+@(\S+\.)*sfsu.edu/;
    return emailChecker.test(email);
}

// registerValidator is used in routes -> user.js to validate the register form request
const registerValidator = (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    // This array is used to store any errors and display to the user once all validations are completed.
    var arr = "The following registration requirements are not fulfilled:";

    if (!checkUsername(username)) {
        arr += "\n Enter a username that is 3 or more alphanumeric characters only.";
    }

    if (!checkEmail(email)) {
        arr += "\n Enter a SFSU email (sfsu.edu).";
    }

    if (!checkPassword(password)) {
        arr += "\n Enter a password that is 8 or more characters.";
    }

    if (password != cpassword) {
        arr += " Password and confirm password inputs must be the same.";
    }

    if (arr.length > 63) {
        req.session.save(err => {
            res.render("register", {
                errorMessage: arr,
                user: username,
                email: email
            });
        })
    } else {
        next();
    }
}

// loginValidator is used in routes -> user.js to validate the login form request
const loginValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let baseSQL = "SELECT id, username, password FROM Users WHERE username = ?;"
    // Check if the username exists in the database, if it does, check if the password input matches. 
    // If login credentials match, user is logged in, else it will display an error message.
    db.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                let hashedPassword = results[0].password;
                return bcrypt.compare(password, hashedPassword);
            }
        })
        .then((passwordsMatched) => {
            if (!passwordsMatched) {
                req.session.save(err => {
                    res.render("login", {
                        errorMessage: "Invalid username and/or password!"
                    });
                })
            } else {
                next();
            }
        })
}

module.exports = { registerValidator, loginValidator };