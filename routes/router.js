const express = require("express");
const router = express.Router();
const path = require('path');
const async = require('async');
const crypto = require("crypto");

const User = require(path.join(__dirname, '../models/user'));
const Post = require(path.join(__dirname, '../models/post'));
const Comment = require(path.join(__dirname, '../models/comment'));

const keys = require(path.join(__dirname, '../config/keys'));
const mailer = require(path.join(__dirname, '../mailer/nodemailer'));

// Authentication Middleware
const loggedInOnly = (req, res, next) => {
    if (req.isAuthenticated()) { next(); }
    else {
        //save the requested page and then redirected
        req.session.pageAfterLogin = req.url;
        req.flash("error", "You must be logged in first!");
        res.redirect("/login");
    }
};

const loggedOutOnly = (req, res, next) => {
    if (req.isUnauthenticated()) next();
    else res.redirect("/");
};

// Route Handlers
function authenticate(passport) {
    // Main/Home Page
    router.get("/", loggedInOnly, (req, res) => {
        Post.find({ deleted: false })
        .then(posts => {
            res.render("index", { posts: posts });
        }).catch(err => next(err));
    });

    // Login View
    router.get("/login", loggedOutOnly, (req, res) => {
        res.render("login", {layout: 'pre_signin'});
    });

    // Login Handler
    router.post("/login",
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true
        })
    );

    // Logout Handler
    router.get("/logout", function(req, res) {
        req.logout(function(err) {
            if (err) { return next(err); }
            req.session.destroy();
            res.redirect("/login");
        });        
    });

    // Forgot password View
    router.get("/forgot", loggedOutOnly, (req, res) => {
        res.render("forgot", {layout: 'pre_signin'});
    });
    
    // Forgot Password handler
    router.post('/forgot', function(req, res, next) {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                User.findOne({ email: req.body.email }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + keys.passwordExpirationTimeInMills // 1 hour

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },
            function(token, user, done) {
                let mailOptions = keys.addKeyValue(keys.forgotMailOptions, 'to', user.email)
                let replaceHostAndToken = mailOptions['text'].replace('<host>', req.headers.host).replace('<token>', token);
                let disableEmailSending = keys.disableEmailSending;
                
                if(disableEmailSending && disableEmailSending == "no") {
                    mailOptions['text'] = replaceHostAndToken
                    mailer.sendMail(mailOptions, function(err, info) {
                        if(info)
                            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                        done(err, info);
                    });
                }
                else {
                    done(`Email sending is disabled`, null);
                }
            }
        ],
        function(err, info) {
            if (err) 
                req.flash('error', "Soomething wrong happened, probably Email sending is disabled.");
            else 
                console.log(info);    
            res.redirect('/forgot');
        });
    });
    
    // Reset password View
    router.get('/reset/:token', function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset',
                { layout: 'pre_signin',
                    token: req.params.token
                });
        });
    });
    
    // Reset password Handler
    router.post('/reset', function(req, res) {
        async.waterfall([
            function(done) {
                User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        done(err, user);
                    });
                });
            },
            function(user, done) {
                let mailOptions = keys.addKeyValue(keys.resetMailOptions, 'to', user.email)
                replaceEmail = mailOptions['text'].replace('<email>', user.email);
                let disableMailSending = keys.disableMailSending;
                
                if(disableMailSending && disableMailSending == "no") {
                    mailOptions['text'] = replaceEmail
                    mailer.sendMail(mailOptions, function(err, info) {
                        req.flash('success', 'Success! Your password has been changed.');
                        done(err, info);
                    });
                }
                else {
                    console.warn("Email sending is disabled, Success! Your password has been changed.");
                }
            }
        ],
        function(err, info) {
            if (err) return next(err);
            res.redirect('/login');
        });
    });

    // Register View
    router.get("/register", loggedOutOnly, (req, res) => {
        res.render("register", {layout: 'pre_signin'});
    });

    // Register Handler
    router.post("/register", (req, res, next) => {
        User.create(req.body)
        .then(user => {
            let regMailOptions = keys.addKeyValue(keys.regMailOptions, 'to', user.email)

            let disableMailSending = keys.disableMailSending;
                
            if(disableMailSending && disableMailSending == "no") {
                mailer.sendMail(regMailOptions, function(err, info) {
                    if (err) console.log(err);
                });
            }
            else {
                console.warn('Email sending is disbaled!');
            }
            req.login(user, err => {
                if (err) { next(err); }
                else {
                    req.flash('success', 'Congrats! Your registration has been successful.');
                    res.redirect("/");
                }
            });
        })
        .catch(err => {
            console.error(err.stack);
            if (err.name === "ValidationError") {
                req.flash("error", "Sorry, that username is already taken.");
                res.redirect("/register");
            } else next(err);
        });
    });

    // Profile View
    router.get('/profile', loggedInOnly, function(req, res, next) {
        res.render('profile');
    });
    
    // Profile Handler
    router.post("/profile", loggedInOnly, (req, res, next) => {
        const newProfile = {
            username: req.body.username,
            profile: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                age: req.body.age,
                gender: req.body.gender,
                address: req.body.address,
                website: req.body.website
            }
        }
        User.findOne({username: req.body.username})
        .exec()
        .then(user => {
            if(user == null) {
                req.flash("error", "Sorry, can not change the username.");
                res.redirect("/profile");
            }
            else if(user && (req.user.username != user.username)) {
                req.flash("error", "Sorry, that username is already taken.");
                res.redirect("/profile");
            }
            else {
                user.username = newProfile.username,
                user.profile = newProfile.profile
                user.save()
                .then(user => { 
                    req.login(user, err => {
                        if (err) { next(err); }
                        else {
                            req.flash('success', 'Profile updated successfully!');
                            res.redirect("/");
                        }
                    });
                })
            }
        })
        .catch(err => {
            console.error(err.stack);
            if (err) {
                req.flash('error', "Soomething wrong happened while updating the user's profile!");
                res.redirect("/");
            } else { res.redirect("/"); }
        });
    });

    // Add Post View
    router.get('/post', loggedInOnly, function(req, res) {
        res.render('post');
    });

    // Add Post Handler
    router.post("/post", (req, res, next) => {
        Post.create(req.body)
        .then(post => {
            req.flash('success', 'Blog Post posted successfully!');
            res.redirect("/");
        })
        .catch(err => {
            console.error(err.stack);
            if (err) {
                req.flash('error', 'Soomething wrong happened while creating the post!');
                res.redirect("/");
            } else next(err);
        });
    });

    // Post Details View
    router.get('/post/:id', loggedInOnly, function(req, res) {
        Post.findById(req.params.id).then(post => {
            if (!post) {
                req.flash('error', 'Post not found.');
                return res.redirect('/');
            }
            post.incrementViews().then(() => {
                res.render("post_detail", { post });
            });
        }).catch(err => {
            req.flash('error', 'Something wrong happened with Post details.');
            next(err);
        });
    });


    router.get('/post/:id/comments', loggedInOnly, function(req, res) {
        Post.findById(req.params.id).populate('comments')
        .exec()
        .then(post => {
            res.render("comment", { post : post });
        })
        .catch(err => {
            console.error(err.stack);
            if (err) {
                req.flash('error', 'Soomething wrong happened while creating the post!');
                res.redirect("/");
            } else next(err);
        });
    });

    // Post Details - Comment Handler 
    router.post("/post/comments", loggedInOnly, (req, res, next) => {
        Post.findById(req.body.postId)
        .exec()
        .then(post => {
            comment = Comment.create({ name : req.body.name,
                email: req.body.email,
                message: req.body.message,
            })
            .then(comment => {
                post.comments.push(comment);
                post.save()
                .then(post => { 
                    req.flash('success', 'Comment added to the Post successfully!');
                    res.redirect("/");
                });
            })
        })
        .catch(err => {
            console.error(err.stack);
            if (err) {
                req.flash('error', 'Soomething wrong happened while creating the post!');
                res.redirect("/");
            } else next(err);
        });
    });

    // Route to render the Edit Post view
    router.get('/post/:id/edit', loggedInOnly, function(req, res, next) {
        Post.findById(req.params.id)
            .then(post => {
                if (!post) {
                    req.flash('error', 'Post not found.');
                    return res.redirect('/');
                }
                res.render('post', { post }); // Use the same view as Add Post
            })
            .catch(err => {
                console.error(err.stack);
                req.flash('error', 'Something went wrong while fetching the post.');
                next(err);
            });
    });

    // Route to handle Edit Post submission
    router.post('/post/:id/edit', loggedInOnly, function(req, res, next) {
        const { title, content } = req.body;

        Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true })
            .then(post => {
                if (!post) {
                    req.flash('error', 'Post not found.');
                    return res.redirect('/');
                }
                req.flash('success', 'Post updated successfully!');
                res.redirect(`/post/${post._id}`);
            })
            .catch(err => {
                console.error(err.stack);
                req.flash('error', 'Something went wrong while updating the post.');
                next(err);
            });
    });
 
    // Route to handle soft delete of a post
    router.post('/post/:id/delete', loggedInOnly, function(req, res, next) {
        Post.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true })
            .then(post => {
                if (!post) {
                    req.flash('error', 'Post not found.');
                    return res.redirect('/');
                }
                // Soft delete related comments
                Comment.updateMany({ _id: { $in: post.comments } }, { deleted: true })
                    .then(() => {
                        req.flash('success', 'Post and its comments have been soft deleted.');
                        res.redirect('/');
                    })
                    .catch(err => {
                        console.error(err.stack);
                        req.flash('error', 'Something went wrong while deleting comments.');
                        next(err);
                    });
            })
            .catch(err => {
                console.error(err.stack);
                req.flash('error', 'Something went wrong while deleting the post.');
                next(err);
            });
    });

    // Route to review soft-deleted posts and comments
    router.get('/admin/review', loggedInOnly, function(req, res, next) {
        if (!req.user.isAdmin) {
            req.flash('error', 'Access denied.');
            return res.redirect('/');
        }

        Post.find({ deleted: true })
            .populate('comments')
            .then(posts => {
                res.render('admin_review', { posts });
            })
            .catch(err => {
                console.error(err.stack);
                req.flash('error', 'Something went wrong while fetching deleted posts.');
                next(err);
            });
    });

    // Route to enable (restore) soft-deleted posts and comments
    router.post('/admin/enable/:id', loggedInOnly, function(req, res, next) {
        if (!req.user.isAdmin) {
            req.flash('error', 'Access denied.');
            return res.redirect('/');
        }

        Post.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true })
            .then(post => {
                if (!post) {
                    req.flash('error', 'Post not found.');
                    return res.redirect('/admin/review');
                }
                // Restore related comments
                Comment.updateMany({ _id: { $in: post.comments } }, { deleted: false })
                    .then(() => {
                        req.flash('success', 'Post and its comments have been restored.');
                        res.redirect('/admin/review');
                    })
                    .catch(err => {
                        console.error(err.stack);
                        req.flash('error', 'Something went wrong while restoring comments.');
                        next(err);
                    });
            })
            .catch(err => {
                console.error(err.stack);
                req.flash('error', 'Something went wrong while restoring the post.');
                next(err);
            });
    });

    return router;
}

module.exports = authenticate;
