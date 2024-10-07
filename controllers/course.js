
const courseModel=require("../models/course");
const APIERROR=require('../utils/apiError');



let getCourses=async function(req,res,next){
    try{
        let courses=await courseModel.find();
        res.status(200).json({status: "success",data:courses})
    }catch(err){
       next(new APIERROR(404,err.message));

    }
}
let getCourseByID=async function(req,res,next){
    const {id}=req.params 
    console.log(req.id);
    
    try{
        let course=await courseModel.findById(id);
        res.status(200).json({status: "success",data:course})
    }catch(err){
       next(new APIERROR(404,err.message));

    }
}


let getCoursesByInstructor= async function (req, res, next) {
       const { instructor_id } = req.params;
  
    try {
      let courses = await courseModel.find({ instructor_id });
    
      if (courses.length === 0) {
           return res.status(404).json({ status:"fail", message: "No courses found for this instructor." });
      }
  
      res.status(200).json({ status:"success", data: courses });
    } catch (err) {
                 next(new APIERROR(500, err.message));
    }
  };

  let getCoursesByTopic = async function (req, res, next) {
    const { topic_id } = req.params;

    try {
        let courses = await courseModel.find({ topic_id });

        if (courses.length === 0) {
            return res.status(404).json({ status: "fail", message: "No courses found for this topic." });
        }

        res.status(200).json({ status: "success", data: courses });
    } catch (err) {
        next(new APIERROR(500, err.message));
    }
};

let getCoursesByCategory = async function (req, res, next) {
    const { category_id } = req.params;

    try {
        let courses = await courseModel.find({ category_id });

        if (courses.length === 0) {
            return res.status(404).json({ status: "fail", message: "No courses found for this category." });
        }

        res.status(200).json({ status: "success", data: courses });
    } catch (err) {
        next(new APIERROR(500, err.message));
    }
};

let getCoursesBySubCategory = async function (req, res, next) {
    const { subcategory_id } = req.params;

    try {
        let courses = await courseModel.find({ subcategory_id });

        if (courses.length === 0) {
            return res.status(404).json({ status: "fail", message: "No courses found for this subcategory." });
        }

        res.status(200).json({ status: "success", data: courses });
    } catch (err) {
        next(new APIERROR(500, err.message));
    }
};



  

let addCourse=async function(req,res){
    req.body.instructor_id=req.id;
    console.log(req.body);
    
    try{
        let course=await courseModel.create(req.body);
        
        res.status(201).json({status: "success",data:course})
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
        res.status(200).json({status: "success",data:course})
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
        res.status(200).json({status: "success",message:"success delete"})
    }catch(err){
        next(new APIERROR(400,err.message));
    }
}



module.exports={getCourses,getCourseByID,addCourse,updateCourse,deleteCourse ,getCoursesByInstructor,getCoursesByTopic,getCoursesByCategory,getCoursesBySubCategory}