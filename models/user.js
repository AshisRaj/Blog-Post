/**
 Module dependencies
*/
const mongoose = require("mongoose"),
    bcrypt = require("bcrypt");
    uniqueValidator = require('mongoose-unique-validator');

//==============================================================================
// Module Variables
//==============================================================================    

// max of 5 attempts, resulting in a 2 hour lock
const SALT_WORK_FACTOR = 12,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 5 * 60 * 1000; //2 * 60 * 60 * 1000;

/**
 Create User Schema
*/

const UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, trim: true,
        // The unique Option is Not a Validator
        required: true, unique: [true, 'is already taken.'], index: true
    },
    email: { type: String, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, exclude: true, allowOnUpdate: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
    profile: {
        firstname: { type: String, lowercase: true, trim: true, index: true, default: '' },
        lastname: { type: String, default: '' },
        age:  { type: Number },
        gender:  { type: String, size: 1 },
        address: { type: String, lowercase: true, trim: true, default: '' },
        website: { type: String, lowercase: true, trim: true, default: '' }
    }
},
{timestamps: true});

// Apply the uniqueValidator plugin to userSchema.
UserSchema.plugin(uniqueValidator);

// expose enum on the model, and provide an internal convenience reference 
const reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

/**
 Schema methods
*/
UserSchema.method('comparePassword', function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.passwordHash, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
});

UserSchema.method('incLoginAttempts', function(cb) {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.update({
          $set: { loginAttempts: 1 },
          $unset: { lockUntil: 1 }
      }, cb);
  }
  // otherwise we're incrementing
  var updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
});

/**
 Static methods
*/
UserSchema.static('getAuthenticated', function(username, password, cb) {
  this.findOne({ username: username }, function(err, user) {
      if (err) return cb(err);

      // make sure the user exists
      if (!user) {
          return cb(null, null, reasons.NOT_FOUND);
      }

      // check if the account is currently locked
      if (user.isLocked) {
          // just increment login attempts if account is already locked
          return user.incLoginAttempts(function(err) {
              if (err) return cb(err);
              return cb(null, null, reasons.MAX_ATTEMPTS);
          });
      }

      // test for a matching password
      user.comparePassword(password, function(err, isMatch) {
          if (err) return cb(err);

          // check if the password was a match
          if (isMatch) {
              // if there's no lock or failed attempts, just return the user
              if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
              // reset attempts and lock info
              var updates = {
                  $set: { loginAttempts: 0 },
                  $unset: { lockUntil: 1 }
              };
              return user.update(updates, function(err) {
                  if (err) return cb(err);
                  return cb(null, user);
              });
          }

          // password is incorrect, so increment login attempts before responding
          user.incLoginAttempts(function(err) {
              if (err) return cb(err);
              return cb(null, null, reasons.PASSWORD_INCORRECT);
          });
      });
  });
});

/**
 Virtual methods
*/
UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, SALT_WORK_FACTOR);
});

UserSchema.virtual("hasGenderMale").get(function() {
  return this.profile.gender == 'M'
});

UserSchema.virtual("hasGenderFemale").get(function() {
  return this.profile.gender == 'F'
});

UserSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

/**
 Create User Model
*/
var User = mongoose.model('User', UserSchema);

// make this available to the users of Node applications
module.exports = User;