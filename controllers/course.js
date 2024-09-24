
const courseModel=require("../models/course");
const APIERROR=require('../utils/apiError');



let getCourses=async function(req,res,next){
    try{
        let courses=await courseModel.find();
        res.status(200).json({courses})
    }catch(err){
       next(new APIERROR(404,err.message));

    }
}

let addCourse=async function(req,res){
    req.body.instructor_id=req.id;
    console.log(req.body);
    
    try{
        let course=await courseModel.create(req.body);
        
        res.status(201).json(course)
    }catch(err){
        next(new APIERROR(400,err.message));
    }
}

let updateCourse=async function(req,res,next){
    try{
        let course=await courseModel.findByIdAndUpdate(req.params.id,req.body);
        
        if(!course){
            return next(new APIERROR(404,"course not found"));
        }
        res.status(200).json(course)
    }catch(err){
        next(new APIERROR(400,err.message));
    }
};

let deleteCourse=async function(req,res,next){
    try{
        let course=await courseModel.findByIdAndDelete(req.params.id);
        
        if(!course){
            return next(new APIERROR(404,"course not found"));
        }
        res.status(200).json({message:"succsse delete"})
    }catch(err){
        next(new APIERROR(400,err.message));
    }
}



module.exports={getCourses,addCourse,updateCourse,deleteCourse}