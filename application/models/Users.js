const db = require("../config/database");
const UserModel = {};
var bcrypt = require('bcrypt');

/** 
* User Model
* ------------
* In the User Model, we have MYSQL queries used for login, registration and user's My Page.
* For login, we use MYSQL query to check if username exists and match the password.
* For registration, we want to validate if the username and email already exists in the
* database because they should be unique to one user only. Lastly, for My Page,
* we want to fetch the user's active posts that they have created and messages that were
* sent to the user for inbox page.
*/

// MYSQL query to add new user account information into database (registration)
UserModel.create = (username, password, email) => {
    return bcrypt.hash(password, 14)
        .then((hashedPassword) => {
            let baseSQL = "INSERT INTO Users(username, email, password, created) VALUES (?,?,?, now());";
            return db.execute(baseSQL, [username, email, hashedPassword]);
        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
}

// MYSQL query to check if username already exists (registration)
UserModel.usernameExists = (username) => {
    return db.execute("SELECT * FROM Users WHERE username = ?", [username])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => Promise.reject(err));
}

// MYSQL query to check if email exists (registration)
UserModel.emailExists = (email) => {
    return db
        .execute("SELECT * FROM Users WHERE email = ?", [email])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => Promise.reject(err));
}

// MYSQL query to check if user input password matches the password from database (login)
UserModel.authenticate = (username, password) => {
    let userId;
    let baseSQL = "SELECT id, username, password FROM Users WHERE username = ?;";
    return db
        .execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                userId = results[0].id;
                return bcrypt.compare(password, results[0].password);
            } else {
                return Promise.resolve(-1);
            }
        })
        .then((passwordsMatch) => {
            if (passwordsMatch) {
                return Promise.resolve(userId);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
};

// MYSQL query to fetch messages that were sent to the user (My Page -> inbox)
UserModel.getMessagesToUser = (userId) => {
    let baseSQL = "SELECT u.username, m.message, date_format(m.created, '%M %e, %Y') as created, m.fk_to_userId, p.title, p.id \
    FROM Users u JOIN Messages m ON u.id=m.fk_from_userId JOIN Posts p ON p.id=m.fk_postId WHERE m.fk_to_userId = ? ORDER BY created DESC;";
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

// MYSQL query to fetch all posts created by the logged in user (My Page -> Posts)
UserModel.getPostsByUser = (userId) => {
    let baseSQL = "SELECT * FROM Posts WHERE fk_userId = ? ORDER BY created DESC;"
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

module.exports = UserModel;