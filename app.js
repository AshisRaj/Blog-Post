
const express = require("express"),
    logger = require('morgan'),
    expressHandlebars = require("express-handlebars"),
    path = require('path'),
    favicon = require('serve-favicon'),
    bodyParser = require("body-parser"),
    expressSession = require("express-session"),
    flash = require("express-flash-messages"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

mongoose.Promise = require("bluebird");

//==============================================================================
// Create app instance
const app = express();
//==============================================================================

const User = require(path.join(__dirname, 'models/user')),
    keys = require(path.join(__dirname, 'config/keys'));

// Templates
const hbs = expressHandlebars.create({
    extname: 'handlebars',
    defaultLayout: "post_signin",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }    
});

// View Engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(favicon(path.join(__dirname, 'public', '/images/favicon.ico')))

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

/**
 Middleware
*/

app.use(logger('dev'));

// Post Data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(
    expressSession({
        resave: false,
        saveUninitialized: true,
        secret:
            process.env.SESSION_SEC || "You must generate a random session secret",
        cookie: { maxAge: keys.cookieMaxAge }	// 10 minutes (also cookie: { _expires: 60000 })
    })
);

// Flash
app.use(flash());

// Connect to Mongoose
app.use((req, res, next) => {
    if (mongoose.connection.readyState) next();
    else {
        const mongoUrl = process.env.MONGO_URL || keys.mongoURI;
        mongoose
        .connect(mongoUrl, { useNewUrlParser: true })
        .then(() => next())
        .catch(err => console.error(`Mongoose Error: ${err.stack}`));
    }
});

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
    User.findById(userId, (err, user) => done(err, user));
});

// Passport Local
const local = new LocalStrategy((username, password, done) => {

    User.getAuthenticated(username, password, function(err, user, reason) {
        if (err) done(err);

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            done(null, user);
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                done(null, false, { message: "Invalid username/password, Try again!" });
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                done(null, false, { message: "Your account is locked out, Try later!" });
                break;
        }
    });

    /*User.findOne({ username })
    .then(user => {
        if (!user || !user.validPassword(password)) {
            done(null, false, { message: "Invalid username/password, Try again!" });
        } else {
            done(null, user);
        }
    })
    .catch(e => done(e));*/
});

passport.use("local", local);

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Routes
app.use("/", require("./routes/router")(passport));

// Start Server
const port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

app.listen(port, () => console.log(`Server running on port ${port}`));
