const db = require("../config/database");
const SearchModel = {};

/** 
* Search Model
* ------------
* This is where all the MYSQL queries for the search and sort is located.
* It is important to know that we are only obtaining posts that is approved by
* the admin before it goes live. To check if the post is approved, we have an attribute
* called approval. If approval = 1, the post has been approved. If it's 0, it's not approved
* and will not show up browsing or in any of the search results.
*
* Note: ORDER by created DESC means sorting the search by Most Recent
*       ORDER by price ASC means sorting the search by price: Low to High
*       ORDER by price DESC means sorting the search by price: High to Low
*/

// MYSQL query to fetch posts that has the search term within either the title or description
SearchModel.searchByTerm = (searchTerm, sort) => {
    let baseSQL;
    if (sort == "sort-by-price-asc") {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_userId, p.photopath, \
            concat_ws(' ', p.title, p.description) AS haystack FROM Users u JOIN \
            Posts p ON u.id=fk_userId WHERE p.approval = 1 HAVING \
            haystack like ? ORDER by p.price ASC;";
    } else if (sort == "sort-by-price-desc") {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_userId, p.photopath, \
        concat_ws(' ', p.title, p.description) AS haystack FROM Users u JOIN \
        Posts p ON u.id=fk_userId WHERE p.approval = 1 HAVING \
        haystack like ? ORDER by p.price DESC;";
    } else {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_userId, p.photopath, \
        concat_ws(' ', p.title, p.description) AS haystack FROM Users u JOIN \
        Posts p ON u.id=fk_userId WHERE p.approval = 1 HAVING \
        haystack like ? ORDER by p.created DESC;"
    }
    let sqlReadySearchTerm = "%" + searchTerm + "%";
    return db.execute(baseSQL, [sqlReadySearchTerm])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
}

// MYSQL query to fetch posts where the category is equal to the drop down selection
SearchModel.searchByCategory = (categoryTerm, sort) => {
    let baseSQL;
    if (sort == "sort-by-price-asc") {
        baseSQL = "SELECT * FROM Users u JOIN Posts p ON u.id=fk_userId \
        WHERE fk_categoryId IN (SELECT id FROM Category WHERE name = ?) AND p.approval = 1 ORDER by p.price ASC;";
    } else if (sort == "sort-by-price-desc") {
        baseSQL = "SELECT * FROM Users u JOIN Posts p ON u.id=fk_userId \
        WHERE fk_categoryId IN (SELECT id FROM Category WHERE name = ?) AND p.approval = 1 ORDER by p.price DESC;";
    } else {
        baseSQL = "SELECT * FROM Users u JOIN Posts p ON u.id=fk_userId \
        WHERE fk_categoryId IN (SELECT id FROM Category WHERE name = ?) AND p.approval = 1 ORDER by p.created DESC";
    }
    return db.query(baseSQL, [categoryTerm])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
}

// MYSQL query that combines searchByTerm() and searchByCategory() functionality
SearchModel.searchByTermAndCategory = (searchTerm, categoryTerm, sort) => {
    let baseSQL;
    if (sort == "sort-by-price-asc") {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_categoryId, p.fk_userId, p.photopath, \
            concat_ws(' ', p.title, p.description) AS haystack FROM Users u JOIN Posts p ON u.id=fk_userId \
            WHERE p.approval = 1 HAVING haystack like ? AND p.fk_categoryId IN (SELECT id FROM Category WHERE name = ?) \
            ORDER by p.price ASC;";
    } else if (sort == "sort-by-price-desc") {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_categoryId, p.fk_userId, p.photopath, \
        concat_ws(' ', p.title, p.description) AS haystack FROM Users u JOIN Posts p ON u.id=fk_userId \
        WHERE p.approval = 1 HAVING haystack like ? AND p.fk_categoryId IN (SELECT id FROM Category WHERE name = ?) \
        ORDER by p.price DESC;";
    } else {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_categoryId, p.fk_userId, p.photopath, \
        concat_ws(' ', p.title, p.description) AS haystack FROM Users u JOIN Posts p ON u.id=fk_userId \
        WHERE p.approval = 1 HAVING haystack like ? AND p.fk_categoryId IN (SELECT id FROM Category WHERE name = ?) \
        ORDER by p.created DESC;";
    }
    let sqlReadySearchTerm = "%" + searchTerm + "%";
    return db.query(baseSQL, [sqlReadySearchTerm, categoryTerm])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
}

// MYSQL query to fetch all posts
SearchModel.getAllPosts = (sort) => {
    let baseSQL;
    if (sort == "sort-by-price-asc") {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_userId, p.photopath, p.created FROM Users u JOIN \
        Posts p ON u.id=fk_userId WHERE p.approval = 1 ORDER by p.price ASC;";
    } else if (sort == "sort-by-price-desc") {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_userId, p.photopath, p.created FROM Users u JOIN \
        Posts p ON u.id=fk_userId WHERE p.approval = 1 ORDER by p.price DESC;";
    } else {
        baseSQL = "SELECT u.username, p.id, p.title, p.description, p.price, p.fk_userId, p.photopath, p.created FROM Users u JOIN \
        Posts p ON u.id=fk_userId WHERE p.approval = 1 ORDER BY p.created DESC";
    }
    return db.execute(baseSQL, [])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

module.exports = SearchModel;