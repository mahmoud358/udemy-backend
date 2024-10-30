const CourseModel = require('../models/course');
const CartModel= require('../models/cart')
const APIERROR = require("../utils/apiError")

const addToCart = async (req, res, next) => {
    const userId = req.id;  
  const courseId = req.params.course_id; 

  try {
      
      const course = await CourseModel.findById(courseId);
      if (!course) {
          return next(new APIERROR(404, "Course not found"));
      }

     
      let cart = await CartModel.findOne({ userId, status: 'inProgress' });

      if (cart) {
          
          if (cart.course_ids.includes(courseId)) {
                     return next(new APIERROR(400, "Course is already in the cart"));
          } else {
             
              cart.course_ids.push(courseId);
              cart.totalPrice += course.price;
          }
      } else {
          
              cart = new CartModel({
                      userId,
                    course_ids: [courseId],
                     totalPrice: course.price,
                  status: 'inProgress'
          });
      }

     
      const savedCart = await cart.save();
      res.status(201).json({ status: "success", data: savedCart });

  } catch (error) {
      return next(new APIERROR(500, error.message)); 
  }
};


const viewCart = async (req, res, next) => {
    const userId = req.id;

    try {
        
        const cart = await CartModel.findOne({ userId, status: 'inProgress' })
            .populate('course_ids');  

              if (!cart) {
               return next(new APIERROR(404, "No active cart found"));
        }

        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        return next(new APIERROR(500, error.message)); 
                }
};



const removeFromCart = async (req, res, next) => {
    const userId = req.id;
    const courseId = req.params.course_id;

    try {
        const cart = await CartModel.findOne({ userId, status: 'inProgress' });
        if (!cart) {
                 return next(new APIERROR(404, "No active cart found"));
        }

        
         const courseIndex = cart.course_ids.indexOf(courseId);
            if (courseIndex === -1) {
                return next(new APIERROR(400, "Course not found in the cart"));
        }
                     cart.course_ids.splice(courseIndex, 1);

                 const course = await CourseModel.findById(courseId);
                  cart.totalPrice -= course.price;

                 
                  
        await cart.save();
        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        return next(new APIERROR(500, error.message)); 
    }
};









module.exports={addToCart,viewCart,removeFromCart}