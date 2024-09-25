const User = require("../models/usersmodel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");
const userRole = require("../utils/user-roles");
const APIERROR = require("../utils/apiError");

require('dotenv').config()

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
        const { username, password, firstName, lastName, email, roles } = req.body;
        const oldUser = await User.findOne({ email })
        if (oldUser){
            return next(new APIERROR(400, "user already exists"))

        }


        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            firstName,
            password: hashedPassword,
            lastName,
            email,
            roles

        })
        //generate jwt token

        const token = await generateJWT({ email: email, _id: newUser._id, role: newUser.roles })
        // newUser.token = token;
        
        
        await newUser.save();
        res.status(201).json({ status: "success", data: token })
    } catch (error) {
        console.error("Error:", error.message);

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
    const token = await generateJWT({ email: user.email, _id: user._id, role: user.roles })
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





module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser, login, updatePassword }