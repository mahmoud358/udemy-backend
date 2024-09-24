const express=require("express");
const {getAllQuiz,getQuizById,createQuiz,updateQuiz,deleteQuiz}=require("../controllers/quiz");

const router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");



router.get("/",getAllQuiz);
router.get("/:id",getQuizById);
router.post("/",auth,allowedTo(userRoles.Instructor),createQuiz);
router.patch("/:id",auth,allowedTo(userRoles.Instructor),updateQuiz);
router.delete("/:id",auth,allowedTo(userRoles.Instructor,userRoles.ADMIN),deleteQuiz);
module.exports=router;
