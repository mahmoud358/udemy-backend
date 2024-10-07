const express = require("express")
const router = express.Router()

const topicListModel = require("../models/tobicmodule")

const categoreylistModel = require('../models/categoreymodule')
const APIERROR = require("../utils/apiError")

// const {relatedcategoreyToTopic} = require("../middleware/topicMiddleWare")

// ****************************************
saveTopic = async (req, res, next) => {

    newTopic = req.body
    try {
        const savedTopic = await topicListModel.create(newTopic)
        res.status(201).json({ status: "success", data: savedTopic })

    } catch (err) {
        return next(new APIERROR(400, err.message))
    }
}


getTopicBysubCategoreyID = async (req, res, next) => {

    const { subcategoreyID } = req.params

    try {
        const getTopic = await topicListModel.find({ subcategoreyID })

        res.status(200).json({ status: "success", data: getTopic })
    } catch (err) {
        return next(new APIERROR(400, err.message))
    }
}

getTopicsByCategoryID = async (req, res, next) => {
    const { categoreyID } = req.params;

    try {
        const topics = await topicListModel.find({ categoreyID })
        
        res.status(200).json({ status: 'success', data: topics });
    } catch (err) {
        return next(new APIERROR(400, err.message));
    }
};




// getTopicById = async (req, res, next) => {
//     const { topicID } = req.params
//     try {
//         const getTopic = await topicListModel.findById(topicID)

//         res.status(200).json({ status: "success", data: getTopic })
//     } catch (err) {
//         return next(new APIERROR(400, err.message))
//     }
// }

getTopicById = async (req, res, next) => {
    const { topicID } = req.params;
    try {
        const topic = await topicListModel.findById(topicID)
            .populate({
                path: 'subcategoreyID',
                select: 'name',
                populate: { path: 'categoreyID', select: 'name' }
            });

        if (!topic) {
            return next(new APIERROR(404, "Topic not found"));
        }


        res.status(200).json({ status: "success", data: topic });
    } catch (err) {
        return next(new APIERROR(400, err.message));
    }
};



deleteTopicById = async (req, res, next) => {
    const { topicID } = req.params
    try {
        const deletedTopic = await topicListModel.findByIdAndDelete(topicID)

        if (deletedTopic) {
            res.status(200).json({ status: "success", message: `Topic with ID : ${topicID} is deleted` })
        }
        else {
            return next(new APIERROR(404, "topic not found"))

        }

    } catch (err) {
        return next(new APIERROR(400, err.message))
    }
}


patchTopoicById = async (req, res, next) => {
    const { topicID } = req.params
    const updateData = req.body
    try {

        const updatedTopic = await topicListModel.findByIdAndUpdate(topicID, { $set: updateData })
        console.log(topicID,);

        if (updatedTopic) {
            res.status(200).json({ status: "success", massage: `Document with ID ${topicID} has been updated` })
        }

        else {
            return next(new APIERROR(404, "topic not found"))

        }
        await updatedTopic.save()
    } catch (err) {
        return next(new APIERROR(400, err.message))

    }

}





// ............................................

module.exports = { saveTopic, getTopicBysubCategoreyID, getTopicById, deleteTopicById, patchTopoicById, getTopicsByCategoryID }

