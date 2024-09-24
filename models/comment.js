const mongoose= require('mongoose')
let CommentSchema =mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comment_text:{
        type:String,
        required:true

    },
    create_at:{
        type:Date,
        default:Date.now
    },
    course_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true
    },

})

const CommentModels= mongoose.model('comments', CommentSchema)

module.exports=CommentModels;
