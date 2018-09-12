/**
 Module dependencies
*/
const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");
  uniqueValidator = require('mongoose-unique-validator');

//==============================================================================
// Module Variables
//==============================================================================    

/**
 Create User Schema
*/

const UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, trim: true,

    // The unique Option is Not a Validator
    required: true, unique: [true, 'is already taken.'], index: true
  },
  email: { type: String, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, exclude: true,
    allowOnUpdate: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profile: {
    firstname: { type: String, lowercase: true, trim: true,
       index: true, default: ''
    },
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

/**
 Schema methods
*/
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

/**
 Virtual methods
*/
UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

UserSchema.virtual("hasGenderMale").get(function() {
  return this.profile.gender == 'M'
});

UserSchema.virtual("hasGenderFemale").get(function() {
  return this.profile.gender == 'F'
});

/**
 Create User Model
*/
var User = mongoose.model('User', UserSchema);

// make this available to the users of Node applications
module.exports = User;