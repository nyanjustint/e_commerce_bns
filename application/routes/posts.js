var express = require('express');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require('../models/Posts');
const PostError = require('../helpers/error/PostError');
const isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");

/**
* Post Router
* ---------------
* This is where the action for creating and deleting a post is located. The user must be logged in. 
* When creating a post, we look at what the user has inputted in the form and call the PostModel.create
* to run the MYSQL query to create the new post and add it to the database. Reminder, the post won't be
* live until the admin has approved it through workbench. For deleting a post, we do the same. We 
* use PostModel.delete to execute the MYSQL delete query to delete the post that the user has made.
*/

// Storing the image to the public -> images folder. 
// The user's original image names are discarded in exchange for randomly generated names to prevent 
// conflicts with duplicate names. The destination points to the images folder in the server.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({ storage: storage });

// Validate image file. File must be png, jpg or jpeg.
const checkImage = (image) => {
    let imageChecker = /\S+(\.png|\.jpg|\.jpeg)/;
    return imageChecker.test(image);
}

// Create post action
router.use('/createpost', isLoggedIn);
router.post('/createpost', uploader.single("image"), (req, res, next) => {

    let title = req.body.title;
    let category = req.body.category;
    let price = req.body.price;
    let description = req.body.description;
    
    if (!checkImage(req.file.filename)) {
        req.session.save(err => {
            res.render("createpost", {
                errorMessage: "Only .jpg, .jpeg, .png image files are accepted.",
                post: title,
                price: price,
                description: description
            });
        });
    } else {
        let filePath = 'images/' + req.file.filename;
        let fk_userId = req.session.userId;

        PostModel.create(title, category, price, description, filePath, fk_userId)
            .then((postWasCreated) => {
                if (postWasCreated) {
                    successPrint('posts.js -> Post created successfully!');
                    req.session.save(err => {
                        res.render("createpost", {
                            successMessage: "Post created successfully! May take up to 24 hours to be approved.",
                        });
                    });
                } else {
                    throw new PostError('Post could not be created.', '/createpost', 250);
                }
            })
            .catch((err) => {
                if (err instanceof PostError) {
                    errorPrint(err.getMessage());
                    res.status(err.getStatus());
                    res.redirect(err.getRedirectURL());
                } else {
                    next(err);
                }
            })
    }
});

// Delete Post action
router.post('/delete', (req, res, next) => {
    let id = req.body.postId;

    PostModel.deletePost(id)
        .then((postDeleted) => {
            if (postDeleted) {
                successPrint('users.js -> Post deleted successfully!');
                req.session.save(err => {
                    req.flash('success', "Post deleted successfully!");
                    req.session.save(err => {
                        res.redirect('back');
                    });
                });
            } else {
                throw new UserError('Message could not be created.', '/', 250);
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
});

module.exports = router;