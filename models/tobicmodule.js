const mongoose = require("mongoose")

let topicSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please,Enter topic name first"],
        unique: [true, 'this name is already exist , topic name must be unique'],
        minLength: 2,
        maxLength: [30, " maximum length is 16 letter"]
    },
    description: {
        type: String,
        required: false,
        unique: false,
        maxLength: [3000, " maximum length is 40 letter"]

    },
    subcategoreyID: {
        type: mongoose.Schema.ObjectId,
        ref: "subcategories",
        required: [true, "Please, Enter your subcategorey"]
    },
    categoreyID: {
        type: mongoose.Schema.ObjectId,
        ref: "categorey",
        required: [true, "Please,Enter categorey Id "]
    },
    learnMoreAbout: {
        type: String
    },
    fromUdemyStudent: {
        type: String
    }

}, { Collection: 'topics' })

const topicmongoose = mongoose.model('topics', topicSchema)

module.exports = topicmongoose
