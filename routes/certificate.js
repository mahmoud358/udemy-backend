const express=require("express");
const {getCertificates,getCertificateByCourseId,getCertificateByUserId,createAndUpdateCertificate,deleteCertificate}=require("../controllers/certificate");
let {auth}=require('../middleware/auth');

const allowedTo = require("../middleware/allowedTo");     
const userRoles = require("../utils/user-roles");   
const router=express.Router();

router.get("/",getCertificates);

router.get("/:course_id",auth,allowedTo(userRoles.USER,userRoles.Instructor),getCertificateByCourseId);
router.get("/certificate/user",auth,allowedTo(userRoles.USER,userRoles.Instructor),getCertificateByUserId);
router.post("/",auth,allowedTo(userRoles.USER,userRoles.Instructor),createAndUpdateCertificate);

// router.put("/:id",updateCertificate);

router.delete("/:id",deleteCertificate);

module.exports=router;