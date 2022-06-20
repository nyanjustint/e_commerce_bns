const routeProtectors = {};
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
const { post } = require("../routes");

/** 
* Route Protectors
* ----------------
* Checks if the user is logged in or not. This is important because only logged in users
* can create a post, send a message to seller and view My Page.
*/

routeProtectors.userIsLoggedIn = function (req, res, next) {
    if (req.session.username) {
        successPrint('User is logged in.');
        next();
    } else {
        errorPrint('User is not logged in.');
        req.session.save(err => {
            res.render("login", {
                errorMessage: "User is not logged in.",
            });
        });
    }
}

module.exports = routeProtectors;