const express=require('express')
let router = express.Router()
let {auth}=require('../middleware/auth');



const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 

const {createNotification,getAllNotification,getNotificationByUesrId}= require('../controllers/notification')

router.post('/',auth,allowedTo(userRoles.USER,userRoles.Instructor),createNotification)
router.get('/',auth,allowedTo(userRoles.ADMIN),getAllNotification)
router.get('/user',auth,allowedTo(userRoles.USER,userRoles.Instructor),getNotificationByUesrId)

module.exports=router
