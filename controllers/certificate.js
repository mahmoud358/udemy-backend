const certificateModel=require("../models/certificate");
const APIERROR=require('../utils/apiError');

let getCertificates=async function(req,res,next){
    try{
        let certificates=await certificateModel.find();
        res.status(200).json({certificates})
    }catch(err){
        return next(new APIERROR(404,err.message));
        }
};

let getCertificateById=async function(req,res,next){
    try{
        let certificate=await certificateModel.findById(req.params.id);
        
        if(!certificate){
            return next(new APIERROR(404,"certificate not found"));
            }
            
        res.status(200).json({certificate})
        
    }catch(err){
        return next(new APIERROR(404,err.message));
        }
};

let createCertificate=async function(req,res,next){
    try{
        let certificate=await certificateModel.create(req.body);
        
        res.status(201).json(certificate)
        
    }catch(err){
        return next(new APIERROR(400,err.message));
        }
};

let updateCertificate=async function(req,res,next){
    try{
        let certificate=await certificateModel.findByIdAndUpdate(req.params.id,req.body);
        
        if(!certificate){
            return next(new APIERROR(404,"certificate not found"));
            }
            
        res.status(200).json(certificate)
        
    }catch(err){
        return next(new APIERROR(400,err.message));
        }
};

let deleteCertificate=async function(req,res,next){
    try{
        let certificate=await certificateModel.findByIdAndDelete(req.params.id);
        
        if(!certificate){
            return next(new APIERROR(404,"certificate not found"));
            }
            
        res.status(200).json({message:"succsse delete"})
        
    }catch(err){
        return next(new APIERROR(400,err.message));
        }
};

module.exports={getCertificates,getCertificateById,createCertificate,updateCertificate,deleteCertificate}