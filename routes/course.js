const express=require("express");
const {getCourses,getCourseByID,addCourse,updateCourse,deleteCourse}=require("../controllers/course");
let router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");     



router.get('/',getCourses);
router.get('/:id',auth,allowedTo(userRoles.Instructor,userRoles.USER),getCourseByID);
router.post('/',auth,allowedTo(userRoles.Instructor,userRoles.USER),addCourse);

router.patch('/:id',auth,allowedTo(userRoles.Instructor,userRoles.USER),updateCourse);

router.delete('/:id',auth,allowedTo(userRoles.Instructor,userRoles.ADMIN,userRoles.USER),deleteCourse);




module.exports=router;