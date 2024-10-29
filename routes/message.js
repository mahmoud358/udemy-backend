const express=require('express')
let router = express.Router()
let {auth}=require('../middleware/auth');



const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 

const {createMessage, getMessages, getChats} = require('../controllers/message')

router.post('/',auth,allowedTo(userRoles.USER,userRoles.Instructor),createMessage)
router.get('/:receiverId',auth,allowedTo(userRoles.USER,userRoles.Instructor),getMessages)
router.get('/',auth,allowedTo(userRoles.USER,userRoles.Instructor),getChats)
module.exports=router