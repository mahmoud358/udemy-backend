const express = require('express')

const router = express.Router()

// ****************************************

saveSubcategorey = async (req, res, next) => {
    var newSubcategory = req.body;
    try {
        const savedSubcategory = await subcategoreylistModel.create(newSubcategory)
        res.status(201).json({ status: 'success', data: savedSubcategory })
    } catch (err) {
        return next(new APIERROR(404, err.message))
    }


}


getSubcategoreyByCategoreyID = async (req, res, next) => {
    let { categoreyID } = req.params
    console.log(categoreyID);


    try {
        let Subcategorey = await subcategoreylistModel.find({ categoreyID })
        res.status(200).json({ status: 'success', data: Subcategorey })
    } catch (err) {
        return next(new APIERROR(404, err.message))
    }
}


getSubcategoreyById = async (req, res, next) => {
    let { id } = req.params

    let getSubcategorey = await subcategoreylistModel.findById(id)

    try {
        if (getSubcategorey) {
            res.status(200).json({ status: "success", data: getSubcategorey })
        }

        else {
            return next(new APIERROR(404, "Subcategorey not found"))

        }
    } catch (err) {
        return next(new APIERROR(404, err.message))

    }

}


deleteSubcategoreyById = async (req, res, next) => {
    let { id } = req.params

    let getSubcategorey = await subcategoreylistModel.findByIdAndDelete(id)

    try {
        if (getSubcategorey) {
            res.status(200).json({ status: "success", massage: `Subcategorey with ID ${id} has been deleted` })
        }

        else {
            return next(new APIERROR(404, "Subcategorey not found"))

        }
    } catch (err) {
        return next(new APIERROR(404, err.message))

    }

}


patchSubcategoreyById = async (req, res, next) => {
    let newSubcategorey = req.body
    let { id } = req.params
    try {
        let getSubcategorey = await categoreylistModel.findByIdAndUpdate(id, { $set: newSubcategorey })

        if (getSubcategorey) {
            res.status(200).json({ status: "success", massage: `Subcategorey with ID ${id} has been updated` })
        }

        else {
            return next(new APIERROR(404, "Subcategorey not found"))

        }
    } catch {
        return next(new APIERROR(404, err.message))

    }
}


//============= exporting methods to routes =====================

module.exports = { getSubcategoreyByCategoreyID, saveSubcategorey, getSubcategoreyById, deleteSubcategoreyById, patchSubcategoreyById }

//============= getting collection todolist and its schema from model  =========

const subcategoreylistModel = require('../models/subcategoreymodule'); const APIERROR = require('../utils/apiError');

