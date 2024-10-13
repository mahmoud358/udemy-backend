const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'paypal', 'stripe']
    },
    paymentStatus: {
        type: String,
        enum: ['successful', 'failed'],
        default: 'successful'
    }
});

const PaymentModel = mongoose.model('Payment', paymentSchema);
module.exports = PaymentModel;
