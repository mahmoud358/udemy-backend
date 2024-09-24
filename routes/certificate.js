const express=require("express");
const {getCertificates,getCertificateById,createCertificate,updateCertificate,deleteCertificate}=require("../controllers/certificate");

const router=express.Router();

router.get("/",getCertificates);

router.get("/:id",getCertificateById);

router.post("/",createCertificate);

router.put("/:id",updateCertificate);

router.delete("/:id",deleteCertificate);

module.exports=router;