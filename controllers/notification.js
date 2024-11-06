const NotificationModel= require('../models/notification')
const APIERROR=require('../utils/apiError');

const createNotification=async(req,res,next)=>{
    let notification=req.body
    try{
        let result=await NotificationModel.create(notification)
        res.status(201).json({status:"success",data:result})
    }catch(err){
        next(new APIERROR(404,err.message));
    }
}
const getAllNotification=async(req,res,next)=>{
    try{
        let result=await NotificationModel.find()
        res.status(200).json({status:"success",data:result})
    }catch(err){
        next(new APIERROR(404,err.message));
    }   
}
const getNotificationByUesrId=async(req,res,next)=>{
    let userId=req.id
    try{
        let result=await NotificationModel.find({userId})
        if(!result){
            next(new APIERROR(404,"no notification found"))
        }
        res.status(200).json({status:"success",data:result})
    }catch(err){
        next(new APIERROR(404,err.message));
    }
}

const updateNotification=async(req,res,next)=>{
    let id=req.params.id
    let notification=req.body
    try{
        let result=await NotificationModel.findByIdAndUpdate(id,notification,{new:true})
        res.status(200).json({status:"success",data:result})
    }catch(err){
        next(new APIERROR(404,err.message));
    }
}       

module.exports={createNotification,getAllNotification,getNotificationByUesrId,updateNotification}
