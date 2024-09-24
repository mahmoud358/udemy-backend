const express=require('express')
const router = express.Router()
let {auth,restrictTo}=require('../middleware/auth');
const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 


const {ReagisterAdmin,getAllAdmin,deletById,updateAdmin,AdminLogin,adminUpdataPassword}= require('../controllers/admin')


router.post("/",ReagisterAdmin)

router.get("/",auth,allowedTo(userRoles.ADMIN),getAllAdmin)

router.delete("/:id",auth,deletById)

router.patch("/:id",auth,updateAdmin)

router.post("/login",AdminLogin)

router.patch("/update/password",auth,adminUpdataPassword)

module.exports=router