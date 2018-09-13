# Blog-Post

This is my 1st Node.js application. It has following functionalities.
1. [User Registration](public/images/screenshots/register.JPG) (email support)
2. [Login/Logout](public/images/screenshots/login.JPG)
3. [Forgot Password](public/images/screenshots/forgot.JPG) (email support) 
4. [Reset Password](public/images/screenshots/reset.JPG) (email support)
5. [View and Edit Profile](public/images/screenshots/profile.JPG)
6. [Add Blog/Post](public/images/screenshots/add_post.JPG)
7. [View Blog/Post](public/images/screenshots/dashboard.JPG)
8. [Add Comment on a Blog/Post](public/images/screenshots/post_details.JPG)
9. [View Comment on a Blog/Post](public/images/screenshots/comment.JPG)

## Technology
1. Node.js (Server side JS)
2. Express.js (Web Application Framework)
3. Mongoose.js (ODM - Object Document Mapper)
4. MongoDB (Ducument Database)
5. NodeMailer.js (Email)
6. Passport.js (Authentication)
7. Passport-local.js (Authentication)
8. Handlebars.js (Template Engine)

## Prerequisites
1. Insatll Node.js [See this](https://www.guru99.com/download-install-node-js.html) for installation steps.
2. Install MongoDB [See this](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) for installation steps.

## Installation
1. Download the project as zip or do a git clone from [here](https://github.com/AshisRaj/Blog-Post)
2. Go to the root dir (Blog-Post).
3. Use the standard node app installation process to use the application (`npm install`).
    - This should install all the dependent node-modules from `package.json`.
    
## Email Setting
The application sends mail for `Successful Registration`, `Forgot Password` and `Successful Reset Password` from `gmail only account`.
1. Edit `config\keys.js`.
2. Change `smtpConfig=>auth` with your gmail account email id and password.
3. Change `from:` with your gmail account email id in `regMailOptions,forgotMailOptions,resetMailOptions`.
4. To disbale email, edit config/keys.js and set `disableEmailSending = "no"`.
**Note** You have to edit your gmail acoount's setting in order to send mail from less secure application. [See this](https://support.google.com/accounts/answer/6010255?hl=en) for more details.


## Start
1. Usual Mode start (code changes do not reflect on the fly) `node app.js`
2. Development Mode Start (code changes reflect on the fly) `SET DEBUG=Blog-Post:* & npm run devstart`
3. Open the application in any browser with http://localhost:8080/

