const adminData= require('../models/admin')
const bcrypt =require("bcryptjs")
const jwt = require('jsonwebtoken')
const APIERROR=require('../utils/apiError');


let ReagisterAdmin=async(req,res,next)=>{
    let admin=req.body
    try{
        let result=await adminData.create(admin)
        res.status(201).json({status:"success",data:result})
    }catch(err){
        next(new APIERROR(404,err.message));
    }

}


let getAllAdmin =async(req,res,next)=>{
    try{
        let result=await adminData.find()
        res.status(200).json({status:"success",data:result})
    }catch(err){
        next(new APIERROR(404,err.message));
    }
}


let deletById =async(req,res,next)=>{
    try{
        let getId=req.params.id
        let result=await adminData.findOneAndDelete(getId)
        if (result) {
            res.status(200).json({status:"success",message:"Admin deleted successfully"})     
        }else{
            next(new APIERROR(404,"Admin not found"))
        }
    }catch(err){
        next(new APIERROR(404,err.message));
    }
}

let updateAdmin=async(req,res,next)=>{
   try {
    let AdminId=req.params.id
    let updateData=req.body
    let resultUpdate=await adminData.updateOne({_id:AdminId},{$set:updateData})
    if(resultUpdate){
        res.status(200).json({status:"success",message:"Admin updated successfully",data:resultUpdate})
    }else{
        next(new APIERROR(404,"Admin not found"))
    }
   } catch (error) {
    next(new APIERROR(404,error.message));
    
   }
}


let AdminLogin = async(req,res,next)=>{
    let{email,password}=req.body
    if (!email||!password) {
        return next(new APIERROR(400,"Please provide email and password")) 
    }
    let admin=await adminData.findOne({email})
    if(!admin){
        return next(new APIERROR(400,"Admin not found"))
    }
    let isMatch=await bcrypt.compare(password,admin.password)
    if(!isMatch){
        return next(new APIERROR(400,"Invalid password"))
    }
    let token=jwt.sign({_id:admin.id,email:admin.email,role:'admin'},process.env.SECRET)
    res.status(200).json({status:"success",token})

}

let adminUpdataPassword=async(req,res,next )=>{
    // console.log(req.body);
    // console.log(req.id);
    
    let{password,NewPassword}=req.body
    if (!NewPassword||!password) {
        return next(new APIERROR(400,"Please provide new password and old password"))
    }
    try{
    let admin=await adminData.findById(req.id)
    if(!admin){
        return next(new APIERROR(404,"Admin not found"))
    }
    let isValid= bcrypt.compare(password,admin.password)
    if(!isValid){
        return next(new APIERROR(400,"Invalid old password"))
    }
    admin.password=NewPassword
     await admin.save()
     let token=jwt.sign({_id:admin.id,email:admin.email,role:'admin'},process.env.SECRET)
    res.status(200).json({status:"success",token})
}catch(err){
    next(new APIERROR(404,err.message));
}
}


module.exports={ReagisterAdmin,getAllAdmin,deletById,updateAdmin,AdminLogin,adminUpdataPassword}