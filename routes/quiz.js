const express=require("express");
const {getAllQuiz,getQuizById,createQuiz,updateQuiz,deleteQuiz,getQuizByModuleId}=require("../controllers/quiz");

const router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");



router.get("/",getAllQuiz);
router.get("/:id",getQuizById);
router.get("/module/:moduleId",getQuizByModuleId);
router.post("/",auth,allowedTo(userRoles.Instructor,userRoles.USER),createQuiz);
router.patch("/:id",auth,allowedTo(userRoles.Instructor,userRoles.USER),updateQuiz);
router.delete("/:id",auth,allowedTo(userRoles.Instructor,userRoles.ADMIN,userRoles.USER),deleteQuiz);
module.exports=router;
