const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    course_id: {
        type: mongoose.Schema.ObjectId,
        ref: "course",
        required: true
    },
    lessonIDs: [{
            type: mongoose.Schema.ObjectId,
            ref: "Lesson"
       
    }],
    quizIDs: [{
            type: mongoose.Schema.ObjectId,
            ref: "quiz"
    }],
    isCompleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true });

module.exports = mongoose.model("certificate", certificateSchema);
