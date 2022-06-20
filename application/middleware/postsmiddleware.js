const { getPostById } = require('../models/Posts');
const postMiddleWare = {};

/** 
* Post middleware
* ---------------
* getPostById post middleware uses getPostById from post model to retrieve the post
* that matches the id of the post that the user wants to view. If the post id exists in the db,
* it will return the results (with the post information).
*/

postMiddleWare.getPostById = async function (req, res, next) {
    try {
        let postId = req.params.id;
        let results = await getPostById(postId);
        if (results && results.length) {
            res.locals.post = results[0];
            next();
        } else {
            res.redirect('/');
        }
    } catch (error) {
        next(err);
    }
}

module.exports = postMiddleWare;