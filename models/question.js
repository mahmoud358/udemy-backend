const mongoose=require("mongoose");

const questionSchema=mongoose.Schema({
    question_text:{
        type:String
    },
    options:[{
        answerText: String,
        isCorrect: Boolean
      }]
});
module.exports=mongoose.model("question",questionSchema);