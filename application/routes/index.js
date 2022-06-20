const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const { getPostById } = require('../middleware/postsmiddleware');
const { getMyPage } = require('../middleware/usermiddleware');
const { searchByTerm, searchByCategory, searchByTermAndCategory, getAllPosts } = require('../middleware/searchmiddleware');


// Home page 
router.get('/', function (req, res, next) {
    res.render('home', { title: "Gator BnS" });
});

// About page 
router.get('/about', function (req, res, next) {
    res.render('about', { title: "About Gator BnS" });
});

// Create a Post page
router.get('/createpost', function (req, res, next) {
    res.render('createpost', { title: "Create New Post" });
});

// Login page
router.get('/login', function (req, res, next) {
    res.render('login', { title: "Sign In" });
});

// Register page
router.get('/register', function (req, res, next) {
    res.render('register', { title: "Register" });
});

// User's My Page
router.use('/mypage', isLoggedIn);
router.get('/mypage', getMyPage, function (req, res, next) {
    res.render('mypage');
});

// Specific post page
router.get('/post/:id(\\d+)', getPostById, (req, res, next) => {
    res.render('viewpost', { title: `Post ${req.params.id}` });
});

// Results page for search term inputted
router.get('/search/term=:searchTerm/:sort', searchByTerm, function (req, res, next) {
    res.render('results');
});

// Results page for category selected and search term inputted
router.get('/search/category=:categoryTerm/:searchTerm/:sort', searchByTermAndCategory, function (req, res, next) {
    res.render('results');
});

// Results page for category selected
router.get('/explore/category=:categoryTerm/:sort', searchByCategory, function (req, res, next) {
    res.render('results');
});

// Results page to display all posts
router.get('/explore/all/:sort', getAllPosts, function (req, res, next) {
    res.render('results');
});

module.exports = router;
