const CouponModels=require('../models/coupon')

let CreateCoupon=async(req,res)=>{
    let coupon=req.body
    try{
        let result=await coupon.save()
        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err)
    }
}

let getAllCoupon=async(req,res)=>{
    try{
        let result=await CouponModels.find().populate('courses')
        res.json(result)
    }catch(err){
        res.status(500).json(err)
    }
}

let getCouponById=async(req,res)=>{
    let id=req.params.id
    try{
        let result=await CouponModels.findById(id).populate('courses')
        if(!result){
            return res.status(404).json({message:" 'Coupon not found'"})
        }
        res.json(result)
    }catch(err){
        res.status(500).json(err)
    }
}

let updateCoupon=async(req,res)=>{
    let id=req.params.id
    let updateData=req.body
    try{
        let resultUpdate=await CouponModels.updateOne({_id:id},{$set:updateData})
        if(!resultUpdate){
            return res.status(404).json({message:"Coupon not found"})
        }
        res.json({message:"Coupon updated successfully"})
    }catch(err){
        res.status(500).json(err)
    }
}

let deleteCoupon=async(req,res)=>{
    let id=req.params.id
    try{
        let resultDelete=await CouponModels.deleteOne({_id:id})
        if(!resultDelete){
            return res.status(404).json({message:"Coupon not found"})
        }
        res.json({message:"Coupon deleted successfully"})
    }catch(err){
        res.status(500).json(err)
    }
}








module.exports={CreateCoupon,getAllCoupon,getCouponById,updateCoupon,deleteCoupon}