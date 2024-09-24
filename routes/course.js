const express=require("express");
const {getCourses,addCourse,updateCourse,deleteCourse}=require("../controllers/course");
let router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");     



router.get('/',getCourses);
router.post('/',auth,allowedTo(userRoles.Instructor),addCourse);

router.patch('/:id',auth,allowedTo(userRoles.Instructor),updateCourse);

router.delete('/:id',auth,allowedTo(userRoles.Instructor,userRoles.ADMIN),deleteCourse);




module.exports=router;