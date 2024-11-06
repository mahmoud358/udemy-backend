const CouponModels = require('../models/coupon');
const courseModel = require('../models/course');
const CourseModel = require('../models/course');
const User = require('../models/usersmodel')
const APIERROR = require("../utils/apiError")
const todayDate = new Date()

let CreateCoupon = async (req, res, next) => {

    try {
        let coupon = req.body
        const oldCoupon = await CouponModels.findOne({ code: coupon.code })

        if (oldCoupon) {
            return next(new APIERROR(400, `coupon with code : ${coupon.code} is already exist `))
        }
        // ---------------------------------------------
        const isCouponValid = new Date(coupon.expireDate) > todayDate

        if(!isCouponValid){
            return next(new APIERROR(400, `Please, make sure that the coupon is not expired `))
          
        }
        const couponCreator = req.params.id

        coupon.createdBy = couponCreator

        let result = await coupon.save()

        res.status(201).json(result)
    } catch (error) {
        next(new APIERROR(400, error.message))

    }
}

let getAllCoupon = async (req, res, next) => {
    try {
        let result = await CouponModels.find().populate('courses')
        res.json(result)
    } catch (err) {
        res.status(500).json(err)
    }
}

let getCouponByCode = async (req, res, next) => {
    let code = req.params.code
    const userId = req.id;
    let courseID = req.body
    try {
        let result = await CouponModels.findById(code).populate('courses')

        if (!result) {
            return res.status(404).json({ message: " 'Coupon not found'" })
        }

        const isCouponValid = new Date(coupon.expiryDate) > todayDate

        if (!isCouponValid) {
            return next(new APIERROR(404, "copoun is expired not found"));
        }

        // --------------------------------------

        const course = await CourseModel.findById(courseID);
        if (!course) {
            return next(new APIERROR(404, "Course not found"));
        }
        //   ----------------------

        let user = await User.findOne({ _id: userId });

        if (!user) {
            return next(new APIERROR(404, "Please, login first"));

        }

        if (user.coupons.includes(result._id)) {
            const isCouponIncluded = user.coupons.filter((couponItem) => {
                couponItem._id == result._id
            })

            if (isCouponIncluded.length > 3) {
                return next(new APIERROR(400, "Exceeded the required limit"))
            }
            user.coupons.push(result._id)

            const coursePriceAfterCoupon=course.price*(1-(result.discountValue/100))
          const courseToUpdate=  await CourseModel.findByIdAndUpdate(course._id,{$set: {priceAfterUserCoupon:coursePriceAfterCoupon}} )
            

            res.status(200).json({ status: "success", data:courseToUpdate ,message:`${result.code} is valid and the price after coupon will be ${coursePriceAfterCoupon} as coupon discound is ${result.discountValue}`});

        }

    } catch (err) {
        res.status(500).json(err)
    }
}

// =============================================
let getCouponByID= async (req, res, next)=>{
    const { id } = req.params

    try{
        const coupon = await CouponModels.findById(id)
    if (!coupon) return next(new APIERROR(404, "user not found"));
    res.status(200).json({ status: "success", data: coupon })
    }catch(err){
        next(new APIERROR(400, err.message))
    }
}
// ===================================================
const addCouponToCourse = async(req, res, next)=>{
   const couponID=req.params.couponID
   const [courses]=req.body
   
   const notfoundCourses=[]
   try{
    const isFoundCoupon= await CouponModels.findById(couponID)
    if(!isFoundCoupon){
        return next(new APIERROR(404, `coupon with ${couponID} is not found`)); 
    }

    // ---------------------------------------
    const isCouponValid = new Date(isFoundCoupon.expireDate) > todayDate

    if(!isCouponValid){
        return next(new APIERROR(400, `Please, make sure that the coupon is not expired `))
      
    }
    // --------------------------
    for (let index = 0; index < courses.length; index++) {
        
        const element = courses[index]

        const course= await courseModel.findById(element)
           
        if (!course) {
            notfoundCourses.push(element);
            continue; 
        }

        const courseToUpdate=  await CourseModel.findByIdAndUpdate(element, 
        {
            $set: {
              couponToApply: isFoundCoupon,
              priceAfterCoupon: course.price * (1 - (isFoundCoupon.discountValue / 100))
            },
            $push: { coupons: isFoundCoupon } 

        })


        if (notfoundCourses.length > 0) {
            return next(new APIERROR(404, `courses with ids: ${notfoundCourses.join(', ')} not found so they are not updated as others `));
        }

        res.status(201).json({status:"success",data:courseToUpdate , message: `coupon with ${isFoundCoupon._id} is added successfully for course ${course._id} ` }); 
        
    }
   }catch(err){
    next(new APIERROR(400, err.message))
}
}  


let updateCoupon = async (req, res) => {
    let id = req.params.id
    let updateData = req.body
    try {
        let resultUpdate = await CouponModels.updateOne({ _id: id }, { $set: updateData })
        if (!resultUpdate) {
            return res.status(404).json({ message: "Coupon not found" })
        }
        res.json({ message: "Coupon updated successfully" })
    } catch (err) {
        res.status(500).json(err)
    }
}
// ===================================================

let deleteCoupon = async (req, res) => {
    let id = req.params.id
    try {
        let resultDelete = await CouponModels.deleteOne({ _id: id })
        if (!resultDelete) {
            return res.status(404).json({ message: "Coupon not found" })
        }
        res.json({ message: "Coupon deleted successfully" })
    } catch (err) {
        res.status(500).json(err)



        
    }
}

// ====================================================

let deleteCouponFromCourse=async (req, res) => {

}








module.exports = { CreateCoupon,addCouponToCourse, getAllCoupon, getCouponByCode,getCouponByID, updateCoupon, deleteCoupon , deleteCouponFromCourse}