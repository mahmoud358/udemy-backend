const express=require("express");
const {getAllLessons,getLessonById,createLesson,updateLesson,deleteLesson,getLessonsByModuleId}=require("../controllers/lesson");
let router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");

router.get('/',getAllLessons);

router.get('/:id',getLessonById);
router.post('/',auth,allowedTo(userRoles.Instructor),createLesson);

router.patch('/:id',auth,allowedTo(userRoles.Instructor,userRoles.USER),updateLesson);

router.delete('/:id',auth,allowedTo(userRoles.Instructor,userRoles.ADMIN,userRoles.USER),deleteLesson);

module.exports=router;

