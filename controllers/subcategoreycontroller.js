const express=require('express')

const router=express.Router()

// ****************************************

saveSubcategorey= async(req,res)=>{
    var newSubcategory= req.body ;
    try{
        const savedSubcategory =await subcategoreylistModel.create(newSubcategory)
        res.json({massage:'success',data:savedSubcategory})
    }catch(err){
        res.json({massage:err.message}).status(400)
    }
    
    
}


getSubcategorey=async(req,res)=>{

    try{
       let Subcategorey= await subcategoreylistModel.find()
       res.json(Subcategorey)
    }catch(err){
        res.json({massage:err.message}).status(400)
    }
 }


 getSubcategoreyById= async (req,res)=>{
    let {id}=req.params
    
    let getSubcategorey= await subcategoreylistModel.findById(id).populate("topics")
     
    try{
        if(getSubcategorey){
            res.status(200).json({massage:"success",data:getSubcategorey})
         }
    
         else{
            res.status(404).json({massage:err.message})
            
         }
    }catch{
        res.status(404).json({massage:err.message})

    }
 
 }


 deleteSubcategoreyById= async (req,res)=>{
    let {id}=req.params
    
    let getSubcategorey= await subcategoreylistModel.findByIdAndDelete(id)
     
    try{
        if(getSubcategorey){
            res.status(200).json({massage:`Subcategorey with ID ${id} has been deleted`})
         }
    
         else{
            res.status(404).json({massage:err.message})
            
         }
    }catch{
        res.status(404).json({massage:err.message})

    }
 
}


patchSubcategoreyById=async(req,res)=>{
    let newSubcategorey=req.body
    let {id}=req.params
    try{
        let getSubcategorey= await categoreylistModel.findByIdAndUpdate(id,{$set:newSubcategorey})

        if(getSubcategorey){
            res.status(200).json({massage:`Subcategorey with ID ${id} has been updated`,data:newCategory})
         }
    
         else{
            res.status(404).json({massage:err.message})
            
         }
    }catch{
        res.status(404).json({massage:err.message})

    }
}


//============= exporting methods to routes =====================

module.exports={getSubcategorey,saveSubcategorey,getSubcategoreyById,deleteSubcategoreyById,patchSubcategoreyById}

//============= getting collection todolist and its schema from model  =========

const subcategoreylistModel= require('../models/subcategoreymodule')
