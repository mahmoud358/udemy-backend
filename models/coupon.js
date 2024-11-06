const mongoose = require('mongoose')
const CouponSchema = mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restrictions: { type: [String], default: [] },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
    }]


})

const CouponModels = mongoose.model('coupons', CouponSchema)
module.exports = CouponModels;