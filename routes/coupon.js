const express =require('express')
const router =express.Router()
let{CreateCoupon,addCouponToCourse,getAllCoupon,addCouponToUserByCode,getCouponByID,updateCoupon,deleteCoupon}=require('../controllers/coupon')
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 


router.post('/',auth,allowedTo(userRoles.ADMIN),CreateCoupon)
router.post('/addcouponTocourse/:couponID',auth,allowedTo(userRoles.ADMIN),addCouponToCourse)

router.get('/',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),getAllCoupon)   

router.post('/code/user/:code',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),addCouponToUserByCode)
router.get('/:id',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),getCouponByID) 

router.patch('/:id',auth,allowedTo(userRoles.USER,userRoles.ADMIN),updateCoupon)

router.delete('/:id',auth,allowedTo(userRoles.ADMIN),deleteCoupon)


module.exports=router