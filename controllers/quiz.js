const quizModel = require("../models/quiz");
const APIERROR = require('../utils/apiError');

let getAllQuiz = async function (req, res, next) {
    try {
        let quizs = await quizModel.find();
        res.status(200).json({ status: "success", quizs })
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
};
let getQuizById = async function (req, res, next) {
    try {
        let quiz = await quizModel.findById(req.params.id);
        res.status(200).json({ status: "success", quiz });
    } catch (err) {
        next(new APIERROR(404, err.message));
    }
}

let createQuiz = async function (req, res, next) {
    try {
        let quiz = await quizModel.create(req.body);
        res.status(201).json({ status: "success", quiz });
        } catch (err) {
            next(new APIERROR(404, err.message));
            }
};
let updateQuiz = async function (req, res, next) {
    try {
        let quiz = await quizModel.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ status: "success", quiz });
        } catch (err) {
            next(new APIERROR(404, err.message));
            }
};
let deleteQuiz = async function (req, res, next) {
    try {
        let quiz = await quizModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", quiz });
        } catch (err) {
            next(new APIERROR(404, err.message));
            }
};
module.exports = {getAllQuiz,getQuizById,createQuiz,updateQuiz,deleteQuiz}

