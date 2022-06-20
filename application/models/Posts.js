const db = require("../config/database");
const PostModel = {};

/** 
* Post Model
* ------------
* The Postmodel.create and Postmodel.delete is used in post router (posts.js in routes folder).
* In order for the user to create a post or delete an existing post they made, we have to use
* the MYSQL queries for that. Postmodel.getPostById is used in index.js (routes) to fetch a
* specific post's details the user wants to view.
*/

// MYSQL query to create a post
PostModel.create = (title, category, price, description, photopath, fk_userId) => {
    let baseSQL = 'SELECT id FROM Category WHERE name = ?;';
    let baseSQL2 = 'INSERT INTO Posts (title, price, description, photopath, created, fk_userId, fk_categoryId) VALUES (?,?,?,?,now(),?,?);';

    return db.execute(baseSQL, [category])
        .then(([results, fields]) => {
            let fk_categoryId = results[0].id;
            return db.execute(baseSQL2, [title, price, description, photopath, fk_userId, fk_categoryId])
                .then(([results, fields]) => {
                    return Promise.resolve(results && results.affectedRows);
                })
        })
        .catch((err) => Promise.reject(err));
}

// MYSQL query to fetch a specific post by the id attribute.
PostModel.getPostById = (postId) => {
    let baseSQL = "SELECT u.username, p.id, p.title, p.description, date_format(p.created, '%M %e, %Y') as created, \
    p.price, p.photopath, p.fk_userId FROM Users u JOIN Posts p ON u.id=fk_userId WHERE p.id=?;"
    return db.execute(baseSQL, [postId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

// MYSQL query to delete a post
PostModel.deletePost = (postId) => {
    let baseSQL = "DELETE FROM Posts WHERE id = ?;"
    return db.execute(baseSQL, [postId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}



module.exports = PostModel;