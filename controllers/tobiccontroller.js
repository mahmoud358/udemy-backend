const express=require("express")
const router=express.Router()

const topicListModel=require("../models/tobicmodule")

const categoreylistModel= require('../models/categoreymodule')

// const {relatedcategoreyToTopic} = require("../middleware/topicMiddleWare")

// ****************************************
saveTopic=async(req,res,next)=>{

    newTopic=req.body
    try{
      const savedTopic=await topicListModel.create(newTopic)
      res.json({status:"success", message:`${savedTopic} issaved`})

    }catch(err){
        res.json({message:err.message}).status(400)
    }
}


getTopic=async(req,res,next)=>{

    try{
        const getTopic=await topicListModel.find()

        res.status(200).json({status:"success", message:getTopic})
    }catch(err){
        res.json({message:err.message}).status(400)
    }
}


getTopicById=async(req,res,next)=>{
   const {topicID}=req.params
    try{
        const getTopic=await topicListModel.findById(topicID).populate('subcategorey')

        res.status(200).json({status:"success", message:getTopic})
    }catch(err){
        res.json({message:err.message}).status(400)
    }
}




deleteTopicById=async(req,res,next)=>{
    const {topicID}=req.params
     try{
        const deletedTopic= await topicListModel.findByIdAndDelete(topicID)

        if(deletedTopic){
            res.status(200).json({message:`Topic with ID : ${topicID} is deleted`})
        }
        else{
        res.json({message:"not found"}).status(404)
        }
        
     }catch(err){
        res.json({message:err.message}).status(400)
    }
}


patchTopoicById=async (req,res,next)=>{
    const{topicID}=req.params
     const updateData=req.body
    try{

        const updatedTopic= await topicListModel.findByIdAndUpdate(topicID,{$set:updateData})
        console.log(topicID,); 

        if(updatedTopic){
            res.status(200).json({massage:`Document with ID ${topicID} has been updated`,data:updatedTopic})
         }
    
         else{
            res.status(404).json({massage:"not found"})
            
         }
       await updatedTopic.save()
    }catch(err){
        res.status(404).json({massage:err.message})
        
    }

}


    


// ............................................

module.exports={saveTopic,getTopic,getTopicById,deleteTopicById,patchTopoicById}

