const quizModel = require("../models/quiz");
const APIERROR = require('../utils/apiError');

let getAllQuiz = async function (req, res, next) {
    try {
        let quizs = await quizModel.find();
        res.status(200).json({ status: "success", data:quizs })
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
};
let getQuizById = async function (req, res, next) {
    try {
        let quiz = await quizModel.findById(req.params.id);
        res.status(200).json({ status: "success", data:quiz });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
}

let getQuizByModuleId = async (req, res, next) => {
    try {
        const quizzes = await quizModel.find({ module_id: req.params.moduleId });

        if (quizzes.length === 0) {
            return next(new APIERROR(404, 'No quizzes found '));
        }

        res.status(200).json({ status: 'success', data: quizzes });
    } catch (error) {
        next(new APIERROR(404, error.message));
    }
};

let createQuiz = async function (req, res, next) {
    try {
        let quiz = await quizModel.create(req.body);
        res.status(201).json({ status: "success", data:quiz });
        } catch (err) {
            next(new APIERROR(404, err.message));
            }
};
let updateQuiz = async function (req, res, next) {
    try {
        let quiz = await quizModel.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ status: "success", data:quiz });
        } catch (err) {
            next(new APIERROR(404, err.message));
            }
};
let deleteQuiz = async function (req, res, next) {
    try {
        let quiz = await quizModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", data:quiz });
        } catch (err) {
            next(new APIERROR(404, err.message));
            }
};
module.exports = {getAllQuiz,getQuizById,createQuiz,updateQuiz,deleteQuiz,getQuizByModuleId}

