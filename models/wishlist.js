let mongoose = require('mongoose')
let wishlistSchema = mongoose.Schema({
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
   
})

const WishlistModel = mongoose.model('wishlist', wishlistSchema)

module.exports = WishlistModel;
