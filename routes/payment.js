const express=require("express");
const {completePayment,capturePayPalOrder,getAllUserPayments,triggerInstructorPayout,getInstructorPayments,getPaymentsByUserId,getAllPayments}=require("../controllers/payment");
let router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');
   




router.post('/',auth,completePayment)
router.post('/capture',auth,capturePayPalOrder)
router.get('/all',auth,getAllUserPayments)
router.post('/payout/:paymentId', auth,triggerInstructorPayout);
router.get('/instructor/:instructorId', auth,getInstructorPayments);
router.get('/user/:userId', auth, getPaymentsByUserId);
router.get('/all-payments',auth, getAllPayments);


module.exports=router;





