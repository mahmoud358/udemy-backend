const express=require('express')

const router=express.Router()

// ****************************************

saveCategorey= async(req,res)=>{
    var newCategory= req.body ;
    try{
        const savedCategory =await categoreylistModel.create(newCategory)
        res.json({massage:'success',data:savedCategory})
    }catch(err){
        res.json({massage:err.message}).status(400)
    }
    
    
}


getCategorey=async(req,res)=>{

    try{
       let categorey= await categoreylistModel.find().populate({
        path:"subcategorey",

       })
       res.json(categorey)
    }catch(err){
        res.json({massage:err.message}).status(400)
    }
 }


 getCategoreyById= async (req,res)=>{
    let {id}=req.params
    
    let getCategorey= await categoreylistModel.findById(id)
     
    try{
        if(getCategorey){
            res.status(200).json({massage:"success",data:getCategorey})
         }
    
         else{
            res.status(404).json({massage:"not found"})
            
         }
    }catch{
        res.status(404).json({massage:err.message})

    }
 
 }


 deleteCategoreyById= async (req,res)=>{
    let {id}=req.params
    
    let getCategorey= await categoreylistModel.findByIdAndDelete(id)
     
    try{
        if(getCategorey){
            res.status(200).json({massage:`categorey with ID ${id} has been deleted`})
         }
    
         else{
            res.status(404).json({massage:err.message})
            
         }
    }catch{
        res.status(404).json({massage:err.message})

    }
 
}


patchCategoreyById=async(req,res)=>{
    let newCategory=req.body
    let {id}=req.params
    try{
        let getCategory= await categoreylistModel.findByIdAndUpdate(id,{$set:newCategory})

        if(getCategory){
            res.status(200).json({massage:`Document with ID ${id} has been updated`,data:newCategory})
         }
    
         else{
            res.status(404).json({massage:err.message})
            
         }
    }catch{
        res.status(404).json({massage:err.message})

    }
}


//============= exporting methods to routes =====================

module.exports={getCategorey,saveCategorey,getCategoreyById,deleteCategoreyById,patchCategoreyById}

//============= getting collection todolist and its schema from model  =========

const categoreylistModel= require('../models/categoreymodule')
