const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
    question_text: {
        type: String
    },
    options: [{
        answerText: String,
        isCorrect: Boolean
    }],
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
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
module.exports = mongoose.model("question", questionSchema);