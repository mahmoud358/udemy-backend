const CommentModels= require('../module/comment')

 
let GetComments =async(req,res)=>{
    let courseId=req.params.course_id
    try{
        let result=await CommentModels.find({courseId})
        res.json(result)
    }catch(err){
        res.status(500).json(err)
    }



}
let GetCommentById=async()=>{
    let commentId=req.params.comment_id
    try{
        let result=await CommentModels.findById(commentId)
        if(result){
            res.json(result)
        }else{
            res.status(404).json({message: 'Comment not found'})
        }
    }catch(err){
        res.status(500).json(err)
    }
 
}

let UpdateComment=async(req,res)=>{
    let commentId=req.params.comment_id
    let commentData=req.body
    try{
        let resultUpdate=await CommentModels.updateOne({_id:commentId},{$set:commentData})
        if(resultUpdate){
            res.json({message:"Comment updated successfully",resultUpdate})
        }else{
            res.status(404).json({message: 'Comment not found'})
        }
    }catch(err){
        res.status(400).json(err)
    }
}


let DeleteComment=async(req,res)=>{
    let commentId=req.params.comment_id
    try{
        let resultDelete=await CommentModels.deleteOne({_id:commentId})
        if(resultDelete){
            res.json({message:"Comment deleted successfully",resultDelete})
        }else{
            res.status(404).json({message: 'Comment not found'})
        }
    }catch(err){
        res.status(400).json(err)
    }
}


    
module.exports=(GetComments,GetCommentById,UpdateComment,DeleteComment)
