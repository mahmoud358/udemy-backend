const mongoose=require("mongoose");


let courseSchema=mongoose.Schema({
    name:{
        type:String,
        minLength:[3,"The name must be greater than 3 letters"],
        required:true
    },
    description:{
        type:String,
        minLength:[10,"The description must be greater than 10 letters"],
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    is_progress_limited:{
        type:Boolean,
        default:false
    },
    instructor_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    certificate:{
        is_available:{type:Boolean},
        certificate_template:{type:String}
    },
    topic_id:{
        type:mongoose.Schema.ObjectId,
        ref:"topics"
    },
    subcategory_id:{
        type:mongoose.Schema.ObjectId,
        ref:"subcategories"
    },
    category_id:{
        type:mongoose.Schema.ObjectId,
        ref:"categorey"
    }
},{ timestamps: true })

let courseModel=mongoose.model("course",courseSchema);

module.exports=courseModel;