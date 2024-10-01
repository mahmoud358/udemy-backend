const lessonModel=require("../models/lesson");
const APIERROR=require('../utils/apiError');

let getAllLessons=async function(req,res,next){
    try{
        let lessons=await lessonModel.find();
        res.status(200).json({status:'success',data:lessons})
    }catch(err){
        return next(new APIERROR(404,err.message));

    }
};

let getLessonById=async function(req,res,next){
    try{
        let lesson=await lessonModel.findById(req.params.id);
        if(!lesson){
            return next(new APIERROR(404,"course not found"));

        }
        res.status(200).json({status:'success',data:lesson})
    }catch(err){
        return next(new APIERROR(404,err.message));
        

    }
};

let createLesson=async function(req,res,next){
    try{
        let lesson=await lessonModel.create(req.body);
        
        res.status(201).json(lesson)
        
    }catch(err){
        return next(new APIERROR(400,err.message));
        }
};

let updateLesson=async function(req,res,next){
    try{
        let lesson=await lessonModel.findByIdAndUpdate(req.params.id,req.body);
        if(!lesson){
            return next(new APIERROR(404,"course not found"));
            }
            
        res.status(200).json({status:'success',message:"success update"})
        
    }catch(err){
        return next(new APIERROR(400,err.message));
        }
};

let deleteLesson=async function(req,res,next){
    try{
        let lesson=await lessonModel.findByIdAndDelete(req.params.id);
        if(!lesson){
            return next(new APIERROR(404,"course not found"));
        }
        res.status(200).json({status:'success',message:"success delete"});
        
    }catch(err){
        return next(new APIERROR(400,err.message));
        }
};

module.exports={getAllLessons,getLessonById,createLesson,updateLesson,deleteLesson};
