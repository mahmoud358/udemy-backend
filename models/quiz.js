const mongoose=require("mongoose");

const quizSchema=mongoose.Schema({
    title:{
        type:String
    },
    module_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"module"
    },
    course_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    },
   
        
});
module.exports=mongoose.model("quiz",quizSchema);