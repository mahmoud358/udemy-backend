const express=require("express");
const {getAllQuestions,getQuestionById,createQuestion,updateQuestion,deleteQuestion}=require("../controllers/question");
const router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");  



router.get("/",getAllQuestions);
router.get("/:id",getQuestionById);
router.post("/",auth,allowedTo(userRoles.Instructor,userRoles.USER),createQuestion);
router.put("/:id",auth,allowedTo(userRoles.Instructor,userRoles.USER),updateQuestion);
router.delete("/:id",auth,allowedTo(userRoles.Instructor,userRoles.ADMIN,userRoles.USER),deleteQuestion);
module.exports=router;
