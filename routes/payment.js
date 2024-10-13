const express=require("express");
const {completePayment,capturePayPalOrder,getAllUserPayments}=require("../controllers/payment");
let router=express.Router();
let {auth,restrictTo}=require('../middleware/auth');
   




router.post('/',auth,completePayment)
router.post('/capture',auth,capturePayPalOrder)
router.get('/all',auth,getAllUserPayments)

module.exports=router;





