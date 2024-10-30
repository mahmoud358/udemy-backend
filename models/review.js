let mongoose = require('mongoose')
let reviewSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewText: {
        type: String,
        default: ''
    }
},{ timestamps: true })

const ReviewModels = mongoose.model('reviews', reviewSchema)

module.exports = ReviewModels;
