const express=require('express')
let router = express.Router()
let {auth}=require('../middleware/auth');
const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles"); 

const {addReview,getReviewsByCourseId,filterReviewsByCourseId}= require('../controllers/review')

router.post('/:course_id',auth,allowedTo(userRoles.USER),addReview)
router.get('/:course_id',auth,allowedTo(userRoles.USER),getReviewsByCourseId)
router.get('/search/:course_id',auth,allowedTo(userRoles.USER),filterReviewsByCourseId)
module.exports=router
