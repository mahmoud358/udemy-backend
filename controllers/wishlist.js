const WishlistModel = require('../models/wishlist')
const APIERROR = require('../utils/apiError')

const addToWishlist = async (req, res, next) => {
    const userId = req.id;
    const courseId = req.params.course_id;

    try {
        let wishlist = await WishlistModel.findOne({ userId })
        if (wishlist) {
            if (wishlist.course_ids.includes(courseId)) {
                return next(new APIERROR(400, "Course is already in the wishlist"))
            } else {
                wishlist.course_ids.push(courseId)
            }


        } else {

            wishlist = new WishlistModel({ userId, course_ids: [courseId] })
        }
        const savedWishlist = await wishlist.save()
        res.status(200).json({ status: "success", message: "Course added to wishlist" })
    } catch (error) {
        console.log(error.message);
        next(new APIERROR(500, error.message))

    }

}

const getAllWishlist = async (req, res, next) => {
    const userId = req.id;
    try {

        const wishlist = await WishlistModel.findOne({ userId }).populate('course_ids')

        res.status(200).json({ status: "success", data: wishlist })
    } catch (error) {
        next(new APIERROR(500, error.message))
    }
}
const getWishlistByUserId = async (req, res, next) => {
    const userId = req.id;
    try {
        const wishlist = await WishlistModel.findOne({ userId }).populate('course_ids')
        if (!wishlist) {
            return next(new APIERROR(404, "you don't have any course in your wishlist"))
        }
        res.status(200).json({ status: "success", data: wishlist })
    } catch (error) {
        next(new APIERROR(500, error.message))
    }
}
const deleteWishlistByCourseId = async (req, res, next) => {
    const userId = req.id;
    const courseId = req.params.course_id;
    try {
        const wishlist = await WishlistModel.findOne({ userId })
        wishlist.course_ids = wishlist.course_ids.filter(id => id.toString() !== courseId)
        const savedWishlist = await wishlist.save()
        res.status(200).json({ status: "success", data: savedWishlist, message: "Course removed from wishlist" })
    } catch (error) {
        next(new APIERROR(500, error.message))
    }
}
const deleteWishlistByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const wishlist = await WishlistModel.findOneAndDelete({ userId })
        res.status(200).json({ status: "success", message: "Wishlist deleted" })
    } catch (error) {
        next(new APIERROR(500, error.message))
    }
}
module.exports = { addToWishlist, getAllWishlist, getWishlistByUserId, deleteWishlistByCourseId, deleteWishlistByUserId }

