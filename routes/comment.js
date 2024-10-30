const express =require("express")
const router =express.Router()
const{GetComments,GetCommentById,UpdateComment,DeleteComment}=require('../controller/comment')

router.get('/',GetComments)

router.get('/:id',GetCommentById)

router.patch('/:id',UpdateComment)

router.delete('/:id',DeleteComment)