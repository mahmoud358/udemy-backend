const moduleModel=require("../models/module");
const APIERROR=require('../utils/apiError');

// Get all modules

let getAllModules = async (req, res, next) => {
    try {
        const modules = await moduleModel.find();
        res.status(200).json({status:'success',data:modules});
    } catch (error) {
        next(new APIERROR(404,error.message));
    }
};

// Get a single module by id

let getModuleById = async (req, res, next) => {
    try {
        const module = await moduleModel.findById(req.params.id).populate("course_id");
        if(!module){
            return next(new APIERROR(404, 'Module not found'));
        }
        res.status(200).json({status:'success',data:module});
    } catch (error) {
        next(new APIERROR(404, 'Module not found'));
    }
};


let getModulesByCourseId = async (req, res, next) => {
    try {
        const modules = await moduleModel.find({ course_id: req.params.courseId });

        if (modules.length === 0) {
            return next(new APIERROR(404, 'No modules found '));
        }

        res.status(200).json({ status: 'success', data: modules });
    } catch (error) {
        next(new APIERROR(404, error.message));
    }
};



// Create a new module

let createModule = async (req, res, next) => {
    try{
        let module=await moduleModel.create(req.body);
        
        res.status(201).json({status:'success',data:module})
    }catch(err){
        next(new APIERROR(400,err.message));
    }
};

// Update a module by id

let updateModule = async (req, res, next) => {
    // console.log(req.body);
    if(req.body=={}){
        return next(new APIERROR(400,'No data provided'));
    }

    try{
        let module=await moduleModel.findByIdAndUpdate(req.params.id,req.body);
        if(!module){
            return next(new APIERROR(404, 'Module not found'));
        }

        
        res.status(200).json({status:'success',message:"success update"})
    }catch(err){
        next(new APIERROR(400,err.message));
    }
};

// Delete a module by id

let deleteModule = async (req, res, next) => {
    try{
        let module=await moduleModel.findByIdAndDelete(req.params.id);
        console.log(module);
        if(!module){
            return next(new APIERROR(404, 'Module not found'));
        }
        res.status(200).json({status:'success',message:"success delete"});
    }catch(err){
        next(new APIERROR(404,err.message));
    }
};
module.exports={getAllModules,getModuleById,createModule,updateModule,deleteModule,getModulesByCourseId}