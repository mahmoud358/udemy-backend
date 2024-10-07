const express = require('express')

const router = express.Router()
const APIERROR = require("../utils/apiError");
// ****************************************

saveCategorey = async (req, res, next) => {
    var newCategory = req.body;
    try {
        const savedCategory = await categoreylistModel.create(newCategory)
        res.status(201).json({ status: 'success', data: savedCategory })
    } catch (err) {
        return next(new APIERROR(400, err.message))
    }


}


getCategorey = async (req, res, next) => {

    try {
        let categorey = await categoreylistModel.find()
        res.status(200).json({ status: 'success', data: categorey })
    } catch (err) {
        return next(new APIERROR(400, err.message))
    }
}


getCategoreyById = async (req, res, next) => {
    let { id } = req.params

    let getCategorey = await categoreylistModel.findById(id)

    try {
        if (getCategorey) {
            res.status(200).json({ status: "success", data: getCategorey })
        }

        else {
            return next(new APIERROR(400, "not found"))

        }
    } catch (err) {
        return next(new APIERROR(404, err.message))

    }

}


deleteCategoreyById = async (req, res, next) => {
    let { id } = req.params

    let getCategorey = await categoreylistModel.findByIdAndDelete(id)

    try {
        if (getCategorey) {
            res.status(200).json({ status: "success", massage: `categorey with ID ${id} has been deleted` })
        }

        else {
            return next(new APIERROR(404, "categorey is not found"))

        }
    } catch (err) {
        return next(new APIERROR(404, err.message))
    }

}


patchCategoreyById = async (req, res, next) => {
    let newCategory = req.body
    let { id } = req.params
    try {
        let getCategory = await categoreylistModel.findByIdAndUpdate(id, { $set: newCategory })

        if (getCategory) {
            res.status(200).json({ status: "success", massage: `Document with ID ${id} has been updated` })
        }

        else {
            return next(new APIERROR(404, "categorey is not found"))

        }
    } catch {
        return next(new APIERROR(404, err.message))

    }
}


//============= exporting methods to routes =====================

module.exports = { getCategorey, saveCategorey, getCategoreyById, deleteCategoreyById, patchCategoreyById }

//============= getting collection todolist and its schema from model  =========

const categoreylistModel = require('../models/categoreymodule');

