const mongoose=require("mongoose");

const lessonShcema=mongoose.Schema({
    title:{
        type:String,
        minLength:[3,"The name must be greater than 3 letters"],
        required:true
    },
    // content:{
    //     type:String,
    //     minLength:[10,"The content must be greater than 10 letters"],
    //     required:true
    // },
    video_link:{
        type:String,
        required:true
    },
    vedioTime:{
        type:Number,
        required:true
    },
    course_id:{
        type:mongoose.Schema.ObjectId,
        ref:"course"
    },
    module_id:{
        type:mongoose.Schema.ObjectId,
        ref:"module"
    },
    instructor_id:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    file_url:{
        type:String,

    }

});

module.exports=mongoose.model("Lesson",lessonShcema);