const CourseModel = require('../models/course');
const CartModel= require('../models/cart')
const APIERROR = require("../utils/apiError")
const CouponModels = require('../models/coupon');

// const addToCart = async (req, res, next) => {
//     const userId = req.id;  
//   const courseId = req.params.course_id; 

//   try {
      
//       const course = await CourseModel.findById(courseId);
//       if (!course) {
//           return next(new APIERROR(404, "Course not found"));
//       }

     
//       let cart = await CartModel.findOne({ userId, status: 'inProgress' });

//       if (cart) {
          
//           if (cart.course_ids.includes(courseId)) {
//                      return next(new APIERROR(400, "Course is already in the cart"));
//           } else {
             
//               cart.course_ids.push(courseId);
//               cart.totalPrice += course.price;
//           }
//       } else {
          
//               cart = new CartModel({
//                       userId,
//                     course_ids: [courseId],
//                      totalPrice: course.price,
//                   status: 'inProgress'
//           });
//       }

     
//       const savedCart = await cart.save();
//       res.status(201).json({ status: "success", data: savedCart });

//   } catch (error) {
//       return next(new APIERROR(500, error.message)); 
//   }
// };


const addToCart = async (req, res, next) => {
    const userId = req.id;  
    const courseId = req.params.course_id; 
    const couponCode = req.query.coupon;
    console.log(couponCode);
    

    try {
        
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new APIERROR(404, "Course not found"));
        }

        // Determine the best price (original, after coupon, or after user coupon)
        let finalPrice = course.price;
        if (course.priceAfterCoupon < finalPrice) {
            finalPrice = course.priceAfterCoupon;
        }
        if(couponCode){
            const coupon = await CouponModels.findOne({code:couponCode});
            if(coupon){
            finalPrice = course.price * (1 - (coupon.discountValue / 100));
            console.log(finalPrice);
            }
        }        
        let cart = await CartModel.findOne({ userId, status: 'inProgress' });

        if (cart) {
            if (cart.courses.some(item => item.course_id.toString() === courseId)) {
                return next(new APIERROR(400, "Course is already in the cart"));
            } else {
                cart.courses.push({
                    course_id: courseId,
                    finalPrice: finalPrice
                });
                cart.totalPrice += finalPrice;
            }
        } else {
            cart = new CartModel({
                userId,
                courses: [{
                    course_id: courseId,
                    finalPrice: finalPrice
                }],
                totalPrice: finalPrice,
                status: 'inProgress'
            });

        }
console.log(cart);

        const savedCart = await cart.save();
        res.status(201).json({ 
            status: "success", 
            data: savedCart,
            appliedPrice: {
                original: course.price,
                final: finalPrice,
                savings: course.price - finalPrice
            }
            
        });

    } catch (error) {
        return next(new APIERROR(500, error.message)); 
    }
};





















// const viewCart = async (req, res, next) => {
//     const userId = req.id;

//     try {
        
//         const cart = await CartModel.findOne({ userId, status: 'inProgress' })
//             .populate('course_ids');  

//               if (!cart) {
//                return next(new APIERROR(404, "No active cart found"));
//         }

//         res.status(200).json({ status: "success", data: cart });
//     } catch (error) {
//         return next(new APIERROR(500, error.message)); 
//                 }
// };





// const viewCart = async (req, res, next) => {
//     const userId = req.id;

//     try {
//         const cart = await CartModel.findOne({ userId, status: 'inProgress' })
//             .populate('course_ids');  

//         if (!cart) {
//             return next(new APIERROR(404, "No active cart found"));
//         }

//         // Calculate savings and best prices for each course
//         const cartDetails = {
//             ...cart._doc,
//             courses: cart.course_ids.map(course => ({
//                 ...course._doc,
//                 originalPrice: course.price,
//                 finalPrice: Math.min(
//                     course.price,
//                     course.priceAfterCoupon || Infinity,
//                     course.priceAfterUserCoupon || Infinity
//                 ),
//                 savings: course.price - Math.min(
//                     course.price,
//                     course.priceAfterCoupon || Infinity,
//                     course.priceAfterUserCoupon || Infinity
//                 )
//             }))
//         };

//         res.status(200).json({ 
//             status: "success", 
//             data: cartDetails,
//             summary: {
//                 totalOriginal: cart.course_ids.reduce((sum, course) => sum + course.price, 0),
//                 totalAfterDiscounts: cart.totalPrice,
//                 totalSavings: cart.course_ids.reduce((sum, course) => sum + course.price, 0) - cart.totalPrice
//             }
//         });
//     } catch (error) {
//         return next(new APIERROR(500, error.message)); 
//     }
// };

const viewCart = async (req, res, next) => {
    const userId = req.id;

    try {
        const cart = await CartModel.findOne({ userId, status: 'inProgress' })
            .populate('courses.course_id');  

        if (!cart) {
            return next(new APIERROR(404, "No active cart found"));
        }
       

        const coursesWithPricing = cart.courses.map(item => {
            const course = item.course_id;
            return {
                ...course._doc,
                originalPrice: course.price,
                finalPrice: item.finalPrice,
                savings: course.price - item.finalPrice
            };
        });
        const totalOriginalPrice = coursesWithPricing.reduce((sum, course) => sum + course.originalPrice, 0);
        const totalFinalPrice = cart.totalPrice;
        res.status(200).json({ 
            status: "success", 
            data: {
                // ...cart._doc,
                _id:cart._id,
                userId:cart.userId,
                // course_ids:cart.course_ids,
                totalPrice:cart.totalPrice,
                status:cart.status,
                courses: coursesWithPricing
            },
            summary: {
                totalOriginal: totalOriginalPrice,
                totalAfterDiscounts: totalFinalPrice,
                totalSavings: totalOriginalPrice - totalFinalPrice
            }
        });
    } catch (error) {
        return next(new APIERROR(500, error.message)); 
    }
};


















// const removeFromCart = async (req, res, next) => {
//     const userId = req.id;
//     const courseId = req.params.course_id;

//     try {
//         const cart = await CartModel.findOne({ userId, status: 'inProgress' });
//         if (!cart) {
//                  return next(new APIERROR(404, "No active cart found"));
//         }

        
//          const courseIndex = cart.course_ids.indexOf(courseId);
//             if (courseIndex === -1) {
//                 return next(new APIERROR(400, "Course not found in the cart"));
//         }
//                      cart.course_ids.splice(courseIndex, 1);

//                  const course = await CourseModel.findById(courseId);
//                   cart.totalPrice -= course.price;

                 
                  
//         await cart.save();
//         res.status(200).json({ status: "success", data: cart });
//     } catch (error) {
//         return next(new APIERROR(500, error.message)); 
//     }
// };



// const removeFromCart = async (req, res, next) => {
//     const userId = req.id;
//     const courseId = req.params.course_id;

//     try {
//         const cart = await CartModel.findOne({ userId, status: 'inProgress' });
//         if (!cart) {
//             return next(new APIERROR(404, "No active cart found"));
//         }

//         const courseIndex = cart.course_ids.indexOf(courseId);
//         if (courseIndex === -1) {
//             return next(new APIERROR(400, "Course not found in the cart"));
//         }

//         const course = await CourseModel.findById(courseId);
//         let priceToDeduct = course.price;
        
//         if (course.priceAfterCoupon && course.priceAfterCoupon < priceToDeduct) {
//             priceToDeduct = course.priceAfterCoupon;
//         }
        
//         if (course.priceAfterUserCoupon && course.priceAfterUserCoupon < priceToDeduct) {
//             priceToDeduct = course.priceAfterUserCoupon;
//         }

//         cart.course_ids.splice(courseIndex, 1);
//         cart.totalPrice -= priceToDeduct;

//         await cart.save();
//         res.status(200).json({ status: "success", data: cart });
//     } catch (error) {
//         return next(new APIERROR(500, error.message)); 
//     }
// };


const removeFromCart = async (req, res, next) => {
    const userId = req.id;
    const courseId = req.params.course_id;
    const currnetPrice=req.query.finalPrice

    try {
        const cart = await CartModel.findOne({ userId, status: 'inProgress' });
        if (!cart) {
            return next(new APIERROR(404, "No active cart found"));
        }

        const courseItem = cart.courses.find(item => item.course_id.toString() === courseId);
        if (!courseItem) {
            return next(new APIERROR(400, "Course not found in the cart"));
        }

        const course = await CourseModel.findById(courseId);
        const priceToDeduct = courseItem.finalPrice;

        cart.courses = cart.courses.filter(item => item.course_id.toString() !== courseId);
        cart.totalPrice -= priceToDeduct;

        const savedCart = await cart.save();
        res.status(200).json({ 
            status: "success", 
            data: savedCart,
            removedItem: {
                courseId,
                originalPrice: course.price,
                finalPrice: priceToDeduct,
                savings: course.price - priceToDeduct
            }
        });
    } catch (error) {
        return next(new APIERROR(500, error.message)); 
    }
};






















module.exports={addToCart,viewCart,removeFromCart}