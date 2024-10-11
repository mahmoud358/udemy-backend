const express=require('express')
let router = express.Router()
let {auth,restrictTo}=require('../middleware/auth');



const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 

const {addToCart,viewCart,removeFromCart}= require('../controllers/cart')

router.post('/:course_id',auth,allowedTo(userRoles.USER),addToCart)

router.get('/',auth,allowedTo(userRoles.USER),viewCart)

router.delete('/:course_id',auth,allowedTo(userRoles.USER),removeFromCart)

module.exports=router
