const mongoose = require('mongoose');
const validator = require('validator');
const userRole = require('../utils/user-roles');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    // required: true,

  },
  lastName: {
    type: String,
    // required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email address']
  },
  paypalEmail: {
    type: String,
    required: false 
},
  dob: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  roles: {
    type: String,
    enum: [userRole.Instructor, userRole.USER],
    default: userRole.USER

  }
  , avatar: {
    type: String,
    default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
  },
  Biography: {
    type: String,
    validate: {
      validator: function (value) {
        // Split the string by spaces and filter out empty strings (extra spaces)
        const wordCount = value.trim().split(/\s+/).length;

        // Return true if word count is exactly 30
        return wordCount >= 2;
      },
      message: 'The Biography  must contain at lest 10 words.' // Custom error message
    }
  },
  Website: {
    type: String,
    validate: {
      validator: function (value) {
        // Split the string by spaces and filter out empty strings (extra spaces)
        const isUrl = validator.isURL(value, {
          protocols: ['http', 'https', 'ftp']
        })

        // Return true if word count is exactly 30
        return isUrl == true;
      },
      message: 'invalid Website URL' // Custom error message
    }
  },
  socialMedia: [{
    name: String,
    URL: {
      type: String,
      validate: {
        validator: function (value) {
          const isUrl = validator.isURL(value, {
            protocols: ['http', 'https', 'ftp']
          })

          return isUrl == true;
        },
        message: (props)=> {
          
          return `the URL '${props.value }' is invalid`;
        }
      }
    }
  }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  coupons: [{ type: mongoose.Schema.ObjectId, ref: "coupons" }],

});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  console.log(resetToken, this.passwordResetToken);

  return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;