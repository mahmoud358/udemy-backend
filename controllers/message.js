const APIERROR = require("../utils/apiError")
const MessageModel = require('../models/message')
// const io = require('../utils/socket').getIo();

const createMessage = async (req, res, next) => {
    const senderId = req.id;
    const { message, receiverId } = req.body;
    try{
        const newMessage = await MessageModel.create({
            senderId,
            receiverId,
            message
        })
        // const io = req.app.get('io');
        const pusher = req.app.get('pusher');
       await pusher.trigger(`chat-${receiverId}`, 'newMessage', newMessage);
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
    const userId = req.id;
    const otherUserId = req.params.receiverId;
    try {
        const messages = await MessageModel.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        if (messages.length === 0) {
            return next(new APIERROR(404, "No messages found between these users"));
        }

        res.status(200).json({
            status: "success",
            message: "Messages fetched successfully",
            data: messages
        });
    } catch (err) {
        next(new APIERROR(400, err.message));
    }
}   

const getChats = async (req, res, next) => {
    const userId = req.id;
    try {
        
        const ObjectId = require('mongoose').Types.ObjectId;
        const userObjectId = new ObjectId(userId);
        // First, find all unique conversations
        const chats = await MessageModel.aggregate([
            // Match messages where user is either sender or receiver
            {
                $match: {
                    $or: [
                        { senderId: userObjectId },
                        { receiverId: userObjectId }
                    ]
                }
            },
            // Sort by creation date descending to get latest messages first
            { $sort: { createdAt: -1 } },
            // Group by conversation participants to get unique conversations
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$senderId", userObjectId] },
                            then: "$receiverId",
                            else: "$senderId"
                        }
                    },
                    // Keep the first (latest) message for each conversation
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        console.log(chats)
        // If no chats found
        if (!chats || chats.length === 0) {
            return next(new APIERROR(404, "no chats found"))
        }
        
        // Extract just the last messages and populate user details
        const populatedChats = await MessageModel.populate(chats.map(chat => chat.lastMessage), [
            { path: "receiverId" }
        ]);
        
        res.status(200).json({
            status: "success",
            message: "Chats fetched successfully",
            data: populatedChats
        })
    } catch(err) {
        next(new APIERROR(400, err.message))
    }
}

module.exports = {createMessage, getMessages, getChats}
