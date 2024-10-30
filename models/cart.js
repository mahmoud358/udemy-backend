let mongoose = require('mongoose')
let cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['inProgress', 'completed'],
        default: 'inProgress'
    }
})

const CartModels = mongoose.model('carts', cartSchema)

module.exports = CartModels;
