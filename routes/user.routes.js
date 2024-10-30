const express = require('express');
const router = express.Router();
const userscontroller = require("../controllers/users.controller");
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");     



router.get("/",userscontroller.getAllUsers );



 router.get("/:userId",auth,allowedTo(userRoles.USER,userRoles.Instructor,userRoles.ADMIN), userscontroller.getSingleUser);


 router.post("/register",userscontroller.createUser );

 router.patch("/:userId",auth,allowedTo(userRoles.USER,userRoles.Instructor,userRoles.ADMIN),userscontroller.updateUser)

 router.delete("/:userId",auth,allowedTo(userRoles.USER,userRoles.Instructor,userRoles.ADMIN), userscontroller.deleteUser);


 router.post("/login",userscontroller.login);

  
 router.put("/updatePassword",auth,allowedTo(userRoles.USER,userRoles.Instructor),userscontroller.updatePassword);

 
 router.post("/forgotPassword",userscontroller.forgotPassword);

 
 router.patch("/resetPassword/:token",userscontroller.resetPassword);

 module.exports= router
