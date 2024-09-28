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
  
  roles:{
    type: String,
    enum:[userRole.Instructor,userRole.USER],
    default: userRole.USER
    
  }
  ,avatar :{
    type:String,
    default:"uploads/profile2.jpg"
  },
  passwordResetToken:String,
  passwordResetExpires:Date
});

userSchema.methods.createResetPasswordToken=function(){
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  console.log(resetToken,this.passwordResetToken);

  return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;