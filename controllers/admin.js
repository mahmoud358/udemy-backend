const adminData= require('../models/admin')
const bcrypt =require("bcryptjs")
const jwt = require('jsonwebtoken')


let ReagisterAdmin=async(req,res)=>{
    let admin=req.body
    try{
        let result=await adminData.create(admin)
        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err)
    }

}


let getAllAdmin =async(req,res)=>{
    try{
        let result=await adminData.find()
        res.json(result)
    }catch(err){
        res.status(500).json(err)
    }
}


let deletById =async(req,res)=>{
    try{
        let getId=req.params.id
        let result=await adminData.findOneAndDelete(getId)
        if (result) {
            res.json({message:"Admin deleted successfully",result})     
        }else{
            res.status(404).json({message: 'Admin not found'})
        }
    }catch(err){
        res.status(500).json(err)
    }
}

let updateAdmin=async(req,res)=>{
   try {
    let AdminId=req.params.id
    let updateData=req.body
    let resultUpdate=await adminData.updateOne({_id:AdminId},{$set:updateData})
    if(resultUpdate){
        res.json({message:"Admin updated successfully",resultUpdate})
    }else{
        res.status(404).json({message: 'Admin not found'})
    }
   } catch (error) {
    res.status(500).json(error.message)
    
   }
}


let AdminLogin = async(req,res)=>{
    let{email,password}=req.body
    if (!email||!password) {
        return res.status(400).json({message: 'Please provide email and password'}) 
    }
    let admin=await adminData.findOne({email})
    if(!admin){
        return res.status(400).json({message: 'Admin not found'})
    }
    let isMatch=await bcrypt.compare(password,admin.password)
    if(!isMatch){
        return res.status(400).json({message: 'Invalid password'})
    }
    let token=jwt.sign({_id:admin.id,email:admin.email,role:'admin'},process.env.SECRET)
    res.json({token})

}

let adminUpdataPassword=async(req,res)=>{
    // console.log(req.body);
    // console.log(req.id);
    
    let{password,NewPassword}=req.body
    if (!NewPassword||!password) {
        return res.status(400).json({message: 'Please provide new password and old password'})
    }
    let admin=await adminData.findById(req.id)
    let isValid= bcrypt.compare(NewPassword,admin.password)
    if(!isValid){
        return res.status(400).json({message: 'Invalid old password'})
    }
    admin.password=NewPassword
     await admin.save()
     let token=jwt.sign({_id:admin.id,email:admin.email,role:'admin'},process.env.SECRET)
    res.json({token})
}


module.exports={ReagisterAdmin,getAllAdmin,deletById,updateAdmin,AdminLogin,adminUpdataPassword}