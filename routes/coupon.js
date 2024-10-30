const express =require('express')
const router =express.Router()
let{CreateCoupon,getAllCoupon,getCouponById,updateCoupon,deleteCoupon}=require('../controllers/coupon')
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 


router.post('/',auth,allowedTo(userRoles.ADMIN),CreateCoupon)

router.get('/',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),getAllCoupon)   

router.get('/:id',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),getCouponById) 

router.patch('/:id',auth,allowedTo(userRoles.ADMIN),updateCoupon)

router.delete('/:id',auth,allowedTo(userRoles.ADMIN),deleteCoupon)

module.exports=router