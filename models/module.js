const mongoose=require("mongoose");

let moduleSchema=mongoose.Schema({
    course_id:{
        type:mongoose.Schema.ObjectId,
        ref:"course"
    },
    name:{
        type:String,
        minLength:[3,"The name must be greater than 3 letters"],
        required:true
    },
    description:{
        type:String,
        minLength:[10,"The description must be greater than 10 letters"],
        required:true
    }
});

module.exports=mongoose.model("module",moduleSchema);