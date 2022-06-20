var express = require('express');
var router = express.Router();
const MessageModel = require('../models/Messages');
const UserError = require("../helpers/error/UserError");
const isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");

/**
* Create Message
* ---------------
* When the user clicks send message, it will first check if the user is logged in. If the user is loged in,
* it will take the data from the form submitted and check if the logged in user is the same as the
* seller user. This is to prevent the user from sending a message to themself. If the ids are not equal,
* user can successfully send a message to the seller.
*/

router.use('/createMessage', isLoggedIn); // Make sure user is logged in in order to send a message
router.post('/createMessage', (req, res, next) => {
    let message = req.body.message;
    let fk_to_userId = req.body.userId;
    let fk_from_userId = req.session.userId;
    let fk_postId = req.body.postId;

    if (fk_to_userId != fk_from_userId) { // Prevent sellers from messaging themselves
        MessageModel.create(message, fk_from_userId, fk_to_userId, fk_postId)
            .then((messageWasCreated) => {
                if (messageWasCreated) {
                    successPrint('users.js -> Message created successfully!');
                    req.session.save(err => {
                        req.flash('success', "Message created successfully!");
                        req.session.save(err => {
                            res.redirect('back');
                        });
                    });
                } else {
                    throw new UserError('Message could not be created.', 'back', 250);
                }
            })
            .catch((err) => {
                if (err instanceof UserError) {
                    errorPrint(err.getMessage());
                    res.status(err.getStatus());
                    res.redirect(err.getRedirectURL());
                } else {
                    next(err);
                }
            });
    } else {
        errorPrint('Message could not be created.');
        res.status(403);
        req.session.save(err => {
            req.flash('error', "You cannot send a message to yourself.");
            req.session.save(err => {
                res.redirect('back');
            });
        });
    }
});

module.exports = router;