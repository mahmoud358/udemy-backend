const express=require("express");
const {getCourses,getCourseByID,addCourse,updateCourse,deleteCourse,getCoursesByInstructor,getCoursesByTopic,getCoursesByCategory,
    searchCoursesByName,getCoursesBySubCategory,filterCourses}=require("../controllers/course");
let router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");     



router.get('/',getCourses);
router.get('/filter', filterCourses);
router.get('/searchByName', searchCoursesByName);

router.get('/instructor/:instructor_id', getCoursesByInstructor);
router.get('/topic/:topic_id', getCoursesByTopic);
router.get('/category/:category_id', getCoursesByCategory);
router.get('/subcategory/:subcategory_id', getCoursesBySubCategory);
router.get('/:id',getCourseByID);


router.post('/',auth,allowedTo(userRoles.Instructor,userRoles.USER),addCourse);

router.patch('/:id',auth,allowedTo(userRoles.Instructor,userRoles.USER),updateCourse);

router.delete('/:id',auth,allowedTo(userRoles.Instructor,userRoles.ADMIN,userRoles.USER),deleteCourse);




module.exports=router;