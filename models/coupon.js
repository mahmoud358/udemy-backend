const mongoose=require('mongoose')
const CouponSchema=mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    discount_percentage:{
        type:Number,
        required:true
    },
    valid_from:{
        type:Date,
        required:true
    },
    valid_to:{
        type:Date,
        required:true
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true
    }]


})

const CouponModels=mongoose.model('coupons',CouponSchema)
module.exports=CouponModels;