const APIERROR = require("../utils/apiError")
const MessageModel = require('../models/message')

const createMessage = async (req, res, next) => {
    const senderId = req.id;
    const { message, receiverId } = req.body;
    try{
        const newMessage = await MessageModel.create({
            senderId,
            receiverId,
            message
        })
        res.status(200).json({
            status: "success",
            message: "Message created successfully",
            data: newMessage
        })
    }catch(err){
        next(new APIERROR(400, err.message))
    }
}

const getMessages = async (req, res, next) => {
    const senderId = req.id;
    const receiverId = req.params.receiverId;
    try{
        const messages = await MessageModel.find({senderId, receiverId})
        if(!messages){
            return next(new APIERROR(404, "no messages found between these users"))
        }
        res.status(200).json({
            status: "success",
            message: "Messages fetched successfully",
            data: messages
        })
    }catch(err){
        next(new APIERROR(400, err.message))
    }
}   

module.exports = {createMessage, getMessages}