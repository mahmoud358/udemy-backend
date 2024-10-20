const User = require("../models/usersmodel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");
const userRole = require("../utils/user-roles");
const APIERROR = require("../utils/apiError");

require('dotenv').config()
const sendEmail = require('../utils/email')
const crypto = require('crypto')

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { "__v": false, "password": false })
        res.status(200).json({ status: "success", data: users })

    } catch (error) {
        next(new APIERROR(404, error.message));
    }

}


const getSingleUser = async (req, res, next) => {
    const { userId } = req.params

    if(userId==req.id){
        const user = await User.findById(userId)
    if (!user) return next(new APIERROR(404, "user not found"));
    res.status(200).json({ status: "success", data: user })
    }else{
        return next(new APIERROR(401, "You are not authorized "));
    }

    

}


const createUser = async (req, res, next) => {
    try {
        // const { username, password, firstName, lastName, email, roles } = req.body;
        const sendUser = req.body;
        
        const oldUser = await User.findOne({ email:sendUser.email })
        if (oldUser){
            return next(new APIERROR(400, "user already exists"))

        }


        const hashedPassword = await bcrypt.hash(sendUser.password, 10)
        sendUser.password=hashedPassword
        

        // const newUser = new User({
        //     username,
        //     firstName,
        //     password: hashedPassword,
        //     lastName,
        //     email,
        //     roles

        // })
        const newUser = new User(sendUser)
        //generate jwt token

        const token = await generateJWT({ email: newUser.email, _id: newUser._id, role: newUser.roles,userName:newUser.username,avatar:newUser.avatar })
        // newUser.token = token;
        
        
        await newUser.save();
        res.status(201).json({ status: "success", data: token })
    } catch (error) {
        // console.error("Error:", error.message);

        next(new APIERROR(400, error.message))
    }
}


const updateUser = async (req, res, next) => {
    const { userId } = req.params

    // const { username, password, firstName, lastName } = req.body;
    const updateUesr = req.body;
    try {
        const user = await User.findById(userId)
        console.log(user);

        if (!user) {
            return  next(new APIERROR(404, "user not found"))

        }


        await User.updateOne({ _id: userId }, { $set: updateUesr })
        res.status(200).json({ status: "success", message: "user is updated" })

    } catch (err) {
        next(new APIERROR(400, err.message))
    }


}

const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.deleteOne({ _id: req.params.userId })
        if (!deletedUser) {
            return next(new APIERROR(404, "user not found"))
        }
        res.json({ status: "success", data: null })
    } catch (err) {
        next(new APIERROR(400, "invalid user id"))
    }
}


const login = async (req, res, next) => {
    const { email, password } = req.body
    if (!email && !password) {
        return next(new APIERROR(400, "please provide email and password"))
    }
    const user = await User.findOne({ email: email })

    if (!user) {
        return next(new APIERROR(400, "invalid credentials"))

    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return next(new APIERROR(400, "invalid credentials"))

    }
    const token = await generateJWT({ email: user.email, _id: user._id, role: user.roles,userName: user.username,avatar: user.avatar })
    res.json({ status: "success", data: token })
}

//upate password 
const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        console.log(req.id);


        const user = await User.findById(req.id);
        if (!user) {
            return next(new APIERROR(404, "User not found"))
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return next(new APIERROR(400, "Invalid old password"))

        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });
        res.json({ status: "success", message: "Password updated successfully", data: token });
    } catch (error) {
        console.error("Error updating password:", error.message);
        next(new APIERROR(500, "Error updating password"))

    }
};

const forgotPassword= async(req,res)=>{
    
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found"})
    
      const resetToken = user.createResetPasswordToken();
      console.log("Before saving user:", user);
      await user.save();
      console.log("After saving user:", user);

    //   console.log("Raw Token (sent in email):", resetToken);
    //   console.log("Hashed Token (stored in DB):", user.resetPasswordToken);
    //   console.log("Token Expiration (stored in DB):", user.resetPasswordExpires);


      const resetUrl = `https://udemy-next-nu.vercel.app/user/resetPassword/${resetToken}`    
    //   const message = `We have received a password reset request,Please user the below link to reset your password \n\n${resetUrl} this reset link will be valid only for 15 minutes `
    
    const message = `
    <p>We have received a password reset request. Please click the button below to reset your password. The link will be valid for only 15 minutes:</p>
    <a href="${resetUrl}" style="display:inline-block; padding:10px 15px; color:white; background-color:#007bff; border-radius:5px; text-decoration:none;">Reset Password</a>
    <p>If the button doesn't work, copy and paste the link below into your browser:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>

  `

      
      try{
        await sendEmail({
            email : user.email,
            subject : 'Password Reset Request',
            html:message
          })
          res.status(200).json({ message: "Email sent successfully" })
      }catch(err){
        user.passwordResetToken = undefined,
        user.passwordResetExpires = undefined
       await  user.save();
        res.status(500).json({ message: 'message: "There was an error sending the email. Try again later.'})
      }
        }


        const resetPassword = async (req, res) => {

            try {
        
                const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
                const user = await User.findOne({
                    passwordResetToken: token,
                    passwordResetExpires: { $gt: Date.now() }
                });
        
        
                if (!user) {
                    return res.status(400).json({ message: "Invalid or expired token" });
                }
        
        
                const { password, confirmPassword } = req.body;
        
        
                if (password !== confirmPassword) {
                    return res.status(400).json({ message: "Passwords do not match" });
                }
        
        
                const hashedPassword = await bcrypt.hash(password, 10);
        
        
                user.password = hashedPassword;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
        
        
                await user.save();
        
        
                res.status(200).json({ message: "Password updated successfully" });
            } catch (error) {
        
                console.error("Error resetting password:", error);
                res.status(500).json({ message: "An error occurred while resetting the password" });
            }
        };




module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser, login, updatePassword ,forgotPassword,resetPassword }