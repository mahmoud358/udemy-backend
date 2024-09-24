const express=require('express')
let router = express.Router()
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 

const {addCart,getCart,updateCart,removeCart}= require('../controllers/cart')

router.post('/',auth,allowedTo(userRoles.USER),addCart)

router.get('/',auth,allowedTo(userRoles.USER),getCart)

router.put('/:course_id',auth,allowedTo(userRoles.USER),updateCart)

router.delete('/:course_id',auth,allowedTo(userRoles.USER),removeCart)

module.exports=router