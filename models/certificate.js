const mongoose=require("mongoose");

const certificateSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    course_id:{
        type:mongoose.Schema.ObjectId,
        ref:"course"
    },
    issue_date:{
        type:Date,
        default:Date.now
    },
    certificate_url:{
        type:String

    }

});
module.exports=mongoose.model("certificate",certificateSchema);

