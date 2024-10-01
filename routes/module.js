const express=require("express");
const {getAllModules,getModuleById,createModule,updateModule,deleteModule,getModulesByCourseId}=require("../controllers/module");
let router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");

router.get('/',getAllModules);

router.get('/:id',getModuleById);

router.get('/course/:courseId', getModulesByCourseId);

router.post('/',auth,allowedTo(userRoles.Instructor),createModule);

router.patch('/:id',auth,allowedTo(userRoles.Instructor),updateModule);

router.delete('/:id',auth,allowedTo(userRoles.Instructor,userRoles.ADMIN),deleteModule);




module.exports=router;