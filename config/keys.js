
const mongoURI = 'mongodb://localhost/blogs';

const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'xyz@xyz.com', // Change it
        pass: 'yourpwd' // Change it
    }
};

// Registration
const regMailOptions = {
    from: 'ashis.raj@gmail.com',
    subject: 'Welcome to Node.js Blog App - Registration Successful!',
    text: 'Congratulations for the successful registration to our web application!',
    html: '<b>Congratulations for the successful registration to our web application!<b>'
};

// Forgot Password
const forgotMailOptions = {
        from: 'xyz@xyz.com', // Change it
        subject: 'Node.js Blog App - Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://<host>/reset/<token>' + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
};

// Reset Password
var resetMailOptions = {
        from: 'xyz@xyz.com', // Change it
        subject: 'Node.js Blog App - Your password has been changed',
        text: 'Hello,\n\n' + 
          'This is a confirmation that the password for your account <email> has just been changed.\n'
};

// Blog/Post creation

// Add new key, value pair to the existing object
const addKeyValue = (obj, key, value) => {
    obj[key] = value;
    return obj;
};

const passwordExpirationTimeInMills = (60 * 60 * 1000); // 1 hour

const cookieMaxAge = (10 * 60 * 1000)	// 10 minutes

const disableEmailSending = "yes";

module.exports = {
    mongoURI, smtpConfig, regMailOptions, forgotMailOptions,
    resetMailOptions, passwordExpirationTimeInMills, cookieMaxAge,
    disableEmailSending, addKeyValue
}
