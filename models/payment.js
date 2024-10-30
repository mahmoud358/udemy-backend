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
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    platformShare: {  
        type: Number,
        required: true
    },
    instructorShare: {  
        type: Number,
        required: true
    },
    instructorPayoutStatus: {  
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'}
    ,
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
    },
    
    instructorPaid: {
        type: Boolean,
        default: false 
    },
    orderId: {
        type: String 
    }
});

const PaymentModel = mongoose.model('Payment', paymentSchema);
module.exports = PaymentModel;
