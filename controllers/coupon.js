const CouponModels = require('../models/coupon');
const courseModel = require('../models/course');
const CourseModel = require('../models/course');
const User = require('../models/usersmodel')
const APIERROR = require("../utils/apiError")
const todayDate = new Date().toISOString()

let CreateCoupon = async (req, res, next) => {
    try {
        let coupon = req.body;

        // Validate required fields
        if (!coupon.code || !coupon.discountValue || !coupon.startDate || !coupon.expiryDate) {
            return next(new APIERROR(400, "Missing required fields"));
        }

        // Check existing coupon
        const oldCoupon = await CouponModels.findOne({ code: coupon.code.toUpperCase() });
        if (oldCoupon) {
            return next(new APIERROR(400, `Coupon with code: ${coupon.code} already exists`));
        }

        // Parse and validate dates
        const startDate = new Date(coupon.startDate);
        const expiryDate = new Date(coupon.expiryDate);
        const currentDate = new Date();

        // Validate date formats
        if (isNaN(startDate.getTime()) || isNaN(expiryDate.getTime())) {
            return next(new APIERROR(400, "Invalid date format. Use ISO format (YYYY-MM-DD)"));
        }

        // Validate date logic
        if (startDate < currentDate) {
            return next(new APIERROR(400, "Start date cannot be in the past"));
        }

        if (expiryDate <= startDate) {
            return next(new APIERROR(400, "Expiry date must be after start date"));
        }

        // Create new coupon with validated data
        const newCoupon = new CouponModels({
            ...coupon,
            code: coupon.code.toUpperCase(),
            startDate: startDate,
            expiryDate: expiryDate,
            createdBy: req.id,
            status: 'active'
        });

        const result = await newCoupon.save();

        res.status(201).json({
            status: "success",
            data: result
        });
    } catch (error) {
        next(new APIERROR(400, error.message));
    }
};

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
    let { courseID } = req.body
    // console.log(courseID)
    // console.log(userId)
    // console.log(code)

    try {
        let result = await CouponModels.findOne({ code: code }).populate('courses')
        if (!result) {
            return res.status(404).json({ message: " 'Coupon not found'" })
        }

        const isCouponValid = new Date(result.expiryDate) > new Date()
        // console.log("isCouponValid",isCouponValid)
        if (!isCouponValid) {
            return next(new APIERROR(404, "copoun is expired not found"));
        }

        // --------------------------------------

        const course = await CourseModel.findById(courseID);
        // console.log("course",course)
        if (!course) {
            return next(new APIERROR(404, "Course not found"));
        }
        //   ----------------------

        let user = await User.findOne({ _id: userId });

        if (!user) {
            return next(new APIERROR(404, "Please, login first"));

        }

        // if (user.coupons.includes(result._id)) {
        const isCouponIncluded = user.coupons.filter((couponItem) => {
            couponItem._id == result._id
        })

        if (isCouponIncluded.length > 3) {
            return next(new APIERROR(400, "Exceeded the required limit"))
        }
        user.coupons.push(result._id)

        const coursePriceAfterCoupon = course.price * (1 - (result.discountValue / 100))
        const courseToUpdate = await CourseModel.updateOne({ _id: courseID }, { $set: { priceAfterUserCoupon: coursePriceAfterCoupon } })


        res.status(200).json({ status: "success", data: courseToUpdate, message: `${result.code} is valid and the price after coupon will be ${coursePriceAfterCoupon} as coupon discound is ${result.discountValue}` });

        // }

    } catch (err) {
        next(new APIERROR(400, err.message))
    }
}

// =============================================
let getCouponByID = async (req, res, next) => {
    const { id } = req.params

    try {
        const coupon = await CouponModels.findById(id)
        if (!coupon) return next(new APIERROR(404, "user not found"));
        res.status(200).json({ status: "success", data: coupon })
    } catch (err) {
        next(new APIERROR(400, err.message))
    }
}
// ===================================================
const addCouponToCourse = async (req, res, next) => {
    const couponID = req.params.couponID
    const { courses } = req.body

    const notfoundCourses = []
    try {
        const isFoundCoupon = await CouponModels.findById(couponID)
        console.log(isFoundCoupon.expiryDate)
        console.log(todayDate)

        if (!isFoundCoupon) {
            return next(new APIERROR(404, `coupon with ${couponID} is not found`));
        }

        // ---------------------------------------
        // const isCouponValid = new Date(isFoundCoupon.expireDate) > todayDate
        const isCouponValid = new Date(isFoundCoupon.expiryDate) > new Date()


        if (!isCouponValid) {
            return next(new APIERROR(400, `Please, make sure that the coupon is not expired `))

        }
        // --------------------------
        for (let index = 0; index < courses.length; index++) {

            const element = courses[index]

            const course = await courseModel.findById(element)

            if (!course) {
                notfoundCourses.push(element);
                continue;
            }

            const courseToUpdate = await CourseModel.findByIdAndUpdate(element,
                {
                    $set: {
                        activeCouponToApply: isFoundCoupon._id,
                        priceAfterCoupon: course.price * (1 - (isFoundCoupon.discountValue / 100))
                    },
                })

            await CouponModels.findByIdAndUpdate(couponID,
                {

                    $push: { courses: element }

                })


            if (notfoundCourses.length > 0) {
                return next(new APIERROR(404, `courses with ids: ${notfoundCourses.join(', ')} not found so they are not updated as others `));
            }


        }
        res.status(201).json({ status: "success", message: `coupon with ${isFoundCoupon._id} is added successfully for course ${courses} ` });
    } catch (err) {
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

let deleteCouponFromCourse = async (req, res) => {

}








module.exports = { CreateCoupon, addCouponToCourse, getAllCoupon, getCouponByCode, getCouponByID, updateCoupon, deleteCoupon }