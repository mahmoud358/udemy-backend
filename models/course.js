const mongoose = require("mongoose");
const validator = require('validator');

let courseSchema = mongoose.Schema({
    name: {
        en: {
            type: String,
            minLength: [3, "The English name must be at least 3 characters long"],
            required: true
        },
        ar: {
            type: String,
            minLength: [3, "اسم الدورة باللغة العربية يجب أن يكون على الأقل 3 أحرف"],
            required: true
        }
    },
    subDescription: {
        en: {
            type: String,
            validate: {
                validator: function (value) {
                    const wordCount = value.trim().split(/\s+/).length;
                    return wordCount >= 10;
                },
                message: 'The English subDescription must be at least 10 words.'
            }
        },
        ar: {
            type: String,
            validate: {
                validator: function (value) {
                    const wordCount = value.trim().split(/\s+/).length;
                    return wordCount >= 10;
                },
                message: 'الوصف الفرعي باللغة العربية يجب أن يكون على الأقل 10 كلمات.'
            }
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
    courseGoals: [{
        en: { type: String },
        ar: { type: String }
    }],
    hours: { type: Number },
    requirements: [{
        en: { type: String },
        ar: { type: String }
    }],
    reviews: [{ type: mongoose.Schema.ObjectId, ref: "reviews" }],
    rating: { type: Number, default: 0 }


}, { timestamps: true })

let courseModel = mongoose.model("course", courseSchema);

module.exports = courseModel;