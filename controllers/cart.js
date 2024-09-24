const cartInfo= require('../models/cart')

 let addCart= async(req,res)=>{
    let userId=req.id
    let coursId=req.params.course_ids
    
    let cartItem=new cartInfo({userId,coursId})
    try{
        let result=await cartItem.save()
        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err)
    }
}

 let getCart =async(req,res)=>{
    let userId=req.id
    try{
        let result=await cartInfo.find({userId})
        res.json(result)
    }catch(err){
        res.status(500).json(err)
    }
}
 let updateCart=async(req,res)=>{
    let userId=req.id
    let courseId=req.params.course_id
    let quantity=req.body.quantity
    try{
        let result=await cartInfo.findOneAndUpdate({userId,courseId},{quantity},{new:true})
        if (!result) return res.status(404).json({message:"Course not found in cart"})
        res.json(result)
    }catch(err){
        res.status(400).json(err)
    }
}

let removeCart=async(req,res)=>{
    let userId=req.id
    let courseId=req.params.course_id
    try{
        let result=await cartInfo.findOneAndDelete({userId,courseId})
        if (!result) return res.status(404).json({message:"Course not found in cart"})
        res.json({message:"Course removed from cart successfully"})
    }catch(err){
        res.status(400).json(err)
    }
}


module.exports={addCart,getCart,updateCart,removeCart}