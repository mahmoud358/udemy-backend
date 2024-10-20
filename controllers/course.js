
const courseModel=require("../models/course");
const APIERROR=require('../utils/apiError');



let getCourses=async function(req,res,next){
    try{
        let courses=await courseModel.find().populate([{
            path: 'instructor_id',
            select: 'username email'
        },{
            path: 'reviews',
            select: 'rating reviewText userName'
        }]);
        res.status(200).json({status: "success",data:courses})

    }catch(err){
       next(new APIERROR(404,err.message));

    }
}
// let getCourseByID=async function(req,res,next){
//     const {id}=req.params 
//     console.log(req.id);
    
//     try{
//         let course=await courseModel.findById(id);
//         res.status(200).json({status: "success",data:course}).populate({
//             path: 'instructor_id',
//             select: 'username email'
//         });
//     }catch(err){
//        next(new APIERROR(404,err.message));
//     }
// }

let getCourseByID = async function(req, res, next) {
    const { id } = req.params;

    try {
        let course = await courseModel.findById(id).populate([{
            path: 'instructor_id',
            select: 'username email'
        },{
            path: 'reviews',
            select: 'rating reviewText userName createdAt'
        }]);

        if (!course) {
            return next(new APIERROR(404, "Course not found"));
        }

        return res.status(200).json({ status: "success", data: course });
    } catch (err) {
        return next(new APIERROR(404, err.message));
    }
};


let searchCoursesByName = async function (req, res, next) {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ status: "fail", message: "Please provide a course name to search." });
    }

    try {
        let courses = await courseModel.find({ "name.en": { $regex: name, $options: "i" } }); 

        if (courses.length === 0) {
            return res.status(404).json({ status: "fail", message: "No courses found with that name." });
        }

        res.status(200).json({ status: "success", data: courses });
    } catch (err) {
        next(new APIERROR(500, err.message));
    }
};



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
        let courses = await courseModel.find({ topic_id }).populate([{
            path: 'instructor_id',
            select: 'username email'
        },{
            path: 'reviews',
            select: 'rating reviewText userName'
        }]);

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
        let courses = await courseModel.find({ category_id })
        .populate([{
            path: 'instructor_id',
            select: 'username email'
        },{
            path: 'reviews',
            select: 'rating reviewText userName'
        }]);

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
        let courses = await courseModel.find({ subcategory_id })
        .populate([{
            path: 'instructor_id',
            select: 'username email'
        },{
            path: 'reviews',
            select: 'rating reviewText userName createdAt'
        }]);

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



let filterCourses = async function (req, res, next) {
    try {

        const { price, hours, category_id, subcategory_id, topic_id } = req.query;
        let filter = {};


        if (price) {
            if (price === "free") {
                filter.price = 0;
            } else if (price === "paid") {
                filter.price = { $gt: 0 };
            }
        }


        if (hours) {
            if (hours === "0-1") {

                filter.hours = { $gte: 0, $lte: 1 };

            } else if (hours === "1-3") {

         filter.hours = { $gte: 1, $lte: 3 };

            } else if (hours === "3-6") {

                 filter.hours = { $gte: 3, $lte: 6 };

            } else if (hours === "6-17") {

                       filter.hours = { $gte: 6, $lte: 17 };

            } else if (hours === "17") {

                filter.hours = { $gt: 17 };

            } else {

                return next(new APIERROR(400, "Invalid "));
            }
        }




        if (category_id) {
            filter.category_id = category_id;
        }


        if (subcategory_id) {
            filter.subcategory_id = subcategory_id;
        }


        if (topic_id) {
            filter.topic_id = topic_id;
        }


        console.log(filter);
        const courses = await courseModel.find(filter).populate([{
            path: 'instructor_id',
            select: 'username email'
        },{
            path: 'reviews',
            select: 'rating reviewText userName'
        }]);


        res.status(200).json({ status: "success", data: courses });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
};




module.exports={getCourses,getCourseByID,addCourse,updateCourse,deleteCourse ,getCoursesByInstructor,getCoursesByTopic,getCoursesByCategory,getCoursesBySubCategory,
    searchCoursesByName ,filterCourses
}
