const express = require('express')
const router = express.Router()
const {addToWishlist, getAllWishlist,getWishlistByUserId,deleteWishlistByCourseId,deleteWishlistByUserId} = require('../controllers/wishlist')
let {auth}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 

router.get('/',auth,allowedTo(userRoles.USER),getAllWishlist)
router.get('/user',auth,allowedTo(userRoles.USER,userRoles.Instructor),getWishlistByUserId)
router.post('/:course_id',auth,allowedTo(userRoles.USER,userRoles.Instructor),addToWishlist)
router.delete('/:course_id',auth,allowedTo(userRoles.USER,userRoles.Instructor),deleteWishlistByCourseId)
router.delete('/delete/:userId',auth,allowedTo(userRoles.ADMIN),deleteWishlistByUserId)
module.exports = router