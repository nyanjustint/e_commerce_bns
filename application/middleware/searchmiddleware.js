const { searchByTerm, searchByCategory, searchByTermAndCategory, getAllPosts } = require('../models/Search');
const searchMiddleWare = {};

/** 
* Search middleware
* -----------------
* searchmiddleware.js is where we call the MYSQL query functions from Search.js (search model),
* obtain the search result and then render it to the results page. When a search 
* result is not found, we render the results page with all posts as an alternative from the 
* database instead of showing no results. 
*/

// Searching by a specific search input (without category selected)
searchMiddleWare.searchByTerm = async function (req, res, next) {
    try {
        let searchTerm = req.params.searchTerm;
        let sort = req.params.sort;
        let results = await searchByTerm(searchTerm, sort);
        if (results.length) {
            res.render("results", {
                title: searchTerm,
                results: results,
                searchTerm: searchTerm,
                inputValue: searchTerm,
                sortValue: sort,
                message: `${results.length} results`
            });
        } else {
            let results = await getAllPosts(sort);
            res.render("results", {
                title: searchTerm,
                searchTerm: searchTerm,
                inputValue: searchTerm,
                results: results,
                sortValue: sort,
                message: `Sorry, we could not find any items for your search but here are some alternatives.`
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// Searching by a specific category
searchMiddleWare.searchByCategory = async function (req, res, next) {
    try {
        let categoryTerm = req.params.categoryTerm;
        let sort = req.params.sort;
        let results = await searchByCategory(categoryTerm, sort);
        if (results.length) {
            res.render("results", {
                title: categoryTerm,
                results: results,
                categoryValue: categoryTerm,
                searchTerm: categoryTerm,
                sortValue: sort,
                message: `${results.length} results`
            });
        } else {
            let results = await getAllPosts(sort);
            res.render("results", {
                title: categoryTerm,
                categoryValue: categoryTerm,
                searchTerm: categoryTerm,
                results: results,
                sortValue: sort,
                message: `Sorry, we could not find any items for your search but here are some alternatives.`
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// Searching by a specific category with a search term inputted 
searchMiddleWare.searchByTermAndCategory = async function (req, res, next) {
    try {
        let searchTerm = req.params.searchTerm;
        let categoryTerm = req.params.categoryTerm;
        let sort = req.params.sort;
        let results = await searchByTermAndCategory(searchTerm, categoryTerm, sort);
        if (results.length) {
            res.render("results", {
                title: searchTerm,
                categoryValue: categoryTerm,
                inputValue: searchTerm,
                results: results,
                searchTerm: searchTerm,
                sortValue: sort,
                message: `${results.length} results`
            });
        } else {
            let results = await getAllPosts(sort);
            res.render("results", {
                title: searchTerm,
                categoryValue: categoryTerm,
                inputValue: searchTerm,
                searchTerm: searchTerm,
                results: results,
                sortValue: sort,
                message: `Sorry, we could not find any items for your search but here are some alternatives.`
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// Fetching all posts from the database
searchMiddleWare.getAllPosts = async function (req, res, next) {
    try {
        let sort = req.params.sort;
        let results = await getAllPosts(sort);
        if (results.length) {
            res.render("results", {
                results: results,
                searchTerm: "Viewing all posts",
                sortValue: sort,
                message: `${results.length} results`,
                title: "Explore All"
            });
        } else {
            res.render("results", {
                title: "All",
                errorMessage: "There are no post created yet.",
            });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = searchMiddleWare;