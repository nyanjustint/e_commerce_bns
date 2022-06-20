const db = require('../config/database');
const MessageModel = {};

/**
* Message Model
* ------------
* For messages, the user can only send a message to the seller. When the user creates a post,
* we will call the MYSQL query to add the message to the database. 
*/

// MYSQL query to add a new message created by the user into the database
MessageModel.create = (message, fk_from_userId, fk_to_userId, fk_postId) => {
    let baseSQL = 'INSERT INTO Messages (message, created, fk_from_userId, fk_to_userId, fk_postId) VALUES (?,now(),?,?,?);';
    return db.execute(baseSQL, [message, fk_from_userId, fk_to_userId, fk_postId])
        .then(([results, fields]) => {
            return Promise.resolve(results && results.affectedRows);
        })
        .catch((err) => Promise.reject(err));
}

module.exports = MessageModel;