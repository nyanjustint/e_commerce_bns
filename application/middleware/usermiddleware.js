const { getMessagesToUser, getPostsByUser } = require('../models/Users');
const userMiddleWare = {};

/** 
* User middleware
* ---------------
* usermiddleware.js utilizes Users.js to obtain the user's information and render it to My Page.
* getMyPage will retrieve and render the logged in user's My Page which includes their active 
* posts and inbox tab.
*/

userMiddleWare.getMyPage = async function (req, res, next) {
    try {
        let results = await getPostsByUser(req.session.userId);
        let inboxResults = await getMessagesToUser(req.session.userId);
        res.render("mypage", {
            title: 'My Page',
            results: results,
            inboxResults: inboxResults,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = userMiddleWare;