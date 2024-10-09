const questionModel = require("../models/question");
const APIERROR = require('../utils/apiError');

let getAllQuestions = async function (req, res, next) {
    try {
        let questions = await questionModel.find();
        res.status(200).json({ status: "success", data:questions });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }

};
let getQuestionById = async function (req, res, next) {
    try {
        let question = await questionModel.findById(req.params.id);
        res.status(200).json({ status: "success", data:question });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
};

let getQuestionsByQuizId = async (req, res, next) => {
    try {
        const Questions = await questionModel.find({ quiz_id: req.params.quizId });

        if (Questions.length === 0) {
            return next(new APIERROR(404, 'No Questions found '));
        }

        res.status(200).json({ status: 'success', data: Questions });
    } catch (error) {
        next(new APIERROR(404, error.message));
    }
};
let createQuestion = async function (req, res, next) {
    try {
        let question = await questionModel.create(req.body);
        console.log(question)
        res.status(201).json({ status: "success", data:question });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
};
let updateQuestion = async function (req, res, next) {
    try {
        let question = await questionModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ status: "success", data:question });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
};
let deleteQuestion = async function (req, res, next) {
    try {
        let question = await questionModel.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: "success", data:question });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
};
module.exports = { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion ,getQuestionsByQuizId};
