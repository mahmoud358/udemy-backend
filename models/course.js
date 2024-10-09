const mongoose = require("mongoose");
const validator = require('validator');

let courseSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "The name must be greater than 3 letters"],
        required: true
    },
    subDescription: {
        type: String,
        validate: {
            validator: function (value) {
                const wordCount = value.trim().split(/\s+/).length;

                // Return true if word count is exactly 30
                return wordCount >= 10;
            },
            message: 'The subDescription  must be at lest 10 words.'
        }
    },
    price: {
        type: Number,
        default: 0
    },
    is_progress_limited: {
        type: Boolean,
        default: false
    },
    instructor_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    certificate: {
        type: Boolean

    },
    topic_id: {
        type: mongoose.Schema.ObjectId,
        ref: "topics"
    },
    subcategory_id: {
        type: mongoose.Schema.ObjectId,
        ref: "subcategories"
    },
    category_id: {
        type: mongoose.Schema.ObjectId,
        ref: "categorey"
    },
    image: {
        type: String
    },
    courseGoals: [{ type: String }],
    hours: { type: Number },
    requirements: [{ type: String }]


}, { timestamps: true })

let courseModel = mongoose.model("course", courseSchema);

module.exports = courseModel;