const nodemailer = require('nodemailer');
const path = require('path');

const keys = require(path.join(__dirname, '../config/keys'));

const sendMail = (mailOptions, callback) => {
    
    var transporter = nodemailer.createTransport(keys.smtpConfig);

    transporter.sendMail(mailOptions, function(err, info) {
        return callback(err, info);
    });
};

module.exports = {sendMail}