# Blog-Post

This is my 1st Node.js application. It has following functionalities.
1. User Registration
2. Login/Logout
3. Forgot Password (email support)
4. Reset Password (email support)
5. View and Edit Profile
6. Add and View Blog/Post
7. Add and View Comment on a Blog/Post

## Installation Prerequisites
1. Insatll Node.js [See this](https://www.guru99.com/download-install-node-js.html) for installation steps.
2. Install MongoDB [See this](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) for installation steps.

## Application Installation
1. Download the project as zip or do a git clone from [here](https://github.com/AshisRaj/Blog-Post)
2. Go to the root dir (Blog-Post).
3. Use the standard node app installation process to use the application (`npm install`).
    - This should install all the dependent node-modules from `package.json`.
    
## Email Settings
The application sends mail for `Successful Registration`, `Forgot Password` and `Successful Reset Password` from `gmail only account`.
**Note** You have to edit your gmail acoount's setting in order to send mail from less secure application. [See this](https://support.google.com/accounts/answer/6010255?hl=en) for more details. 

1. Edit `config\keys.js`.
2. Change `smtpConfig=>auth` with your gmail account email id and password.
3. Change `from:` with your gmail account email id in `regMailOptions,forgotMailOptions,resetMailOptions`.

## Application Start
1. Usual Mode start (code changes do not reflect on the fly) `node app.js`
2. Development Mode Start (code changes reflect on the fly) `SET DEBUG=Blog-Post:* & npm run devstart`
3. Open the application in any browser with http://localhost:8080/

    

