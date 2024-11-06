const express =require('express')
const router =express.Router()
let{CreateCoupon,addCouponToCourse,getAllCoupon,getCouponByCode,getCouponByID,updateCoupon,deleteCoupon}=require('../controllers/coupon')
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 


router.post('/',auth,allowedTo(userRoles.USER),CreateCoupon)
router.post('/addcouponTocourse',auth,allowedTo(userRoles.USER),addCouponToCourse)

router.get('/',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),getAllCoupon)   

router.get('/code/:code',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),getCouponByCode)
router.get('/:id',auth,allowedTo(userRoles.ADMIN,userRoles.USER,userRoles.Instructor),getCouponByID) 

router.patch('/:id',auth,allowedTo(userRoles.ADMIN),updateCoupon)

router.delete('/:id',auth,allowedTo(userRoles.ADMIN),deleteCoupon)
router.delete('/fromCourse/:id',auth,allowedTo(userRoles.ADMIN),deleteCoupon)

module.exports=router