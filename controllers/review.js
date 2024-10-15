const CourseModel = require('../models/course');
const ReviewModel = require('../models/review');
const APIERROR = require("../utils/apiError")

const addReview = async (req, res, next) => {
      
  const courseId = req.params.course_id; 
  const { rating, reviewText, userName } = req.body;
  const NewReview = new ReviewModel({
    courseId,
    rating,
    reviewText,
    userName
  })

  try {
    const savedReview = await NewReview.save();
    const course = await CourseModel.findByIdAndUpdate(courseId, { $push: { reviews: savedReview._id } });
    const averageRating = await ReviewModel.aggregate([
      { $match: { courseId: course._id } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);
    console.log(averageRating)
    const newRating = averageRating[0]?.averageRating || 0;
    await CourseModel.findByIdAndUpdate(courseId, { rating: newRating });


    if (!course) {
      return next(new APIERROR(404, "Course not found"));
    }   
    res.status(201).json({status:"success",data:savedReview, message: "Review added successfully" }); 
   
    
    
  }
  catch (error) {
    next(new APIERROR(400,err.message));
  }
}
const getReviewsByCourseId=async(req,res,next)=>{
  const courseId = req.params.course_id; 
  try {
    const reviews = await ReviewModel.find({ courseId });
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    next(new APIERROR(400, error.message));
  }
}
const filterReviewsByCourseId=async(req,res,next)=>{
    const courseId = req.params.course_id;
  const {rating,reviewText}=req.query
  const query={}
  query.courseId=courseId
  
  if(rating){
    query.rating=rating
  }
  if(reviewText){
    query.reviewText={$regex:reviewText,$options:"i"}
  }
  console.log(query);
  
  try {
    const reviews = await ReviewModel.find(query);
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    next(new APIERROR(400, error.message));
  }

}   

module.exports = {
  addReview,
  getReviewsByCourseId,
  filterReviewsByCourseId
}

