const certificateModel = require("../models/certificate");
const lessonModel = require("../models/lesson");
const quizModel = require("../models/quiz");
const APIERROR = require('../utils/apiError');
const NotificationModel= require('../models/notification')
const MessageModel = require('../models/message')
let getCertificates = async function (req, res, next) {
    try {
        let certificates = await certificateModel.find().populate({path:"user_id",select:"username"});
        res.status(200).json({status:"success",data:certificates })
    } catch (err) {
        return next(new APIERROR(404, err.message));
    }
};

let getCertificateByCourseId = async function (req, res, next) {
    const user_id = req.id;
    const course_id = req.params.course_id;
    try {
        let certificate = await certificateModel.findOne({ course_id, user_id }).populate([{path:"user_id",select:"username"},{path:"course_id",select:"name"}]);

        if (!certificate) {
            return next(new APIERROR(404, "certificate not found"));
        }

        res.status(200).json({ status: "success", data: certificate })

    } catch (err) {
        return next(new APIERROR(404, err.message));
    }
};
let getCertificateByUserId = async function (req, res, next) {
    const user_id = req.id;
    
    try {
        let certificate = await certificateModel.find({ user_id });

        if (certificate.length == 0) {
            return next(new APIERROR(404, "you don't have any certificate"));
        }

        res.status(200).json({ status: "success", data: certificate })

    } catch (err) {
        return next(new APIERROR(404, err.message));
    }
};

let createAndUpdateCertificate = async function (req, res, next) {
    const user_id = req.id;
    const { course_id, lessonID, quizID } = req.body;
    const lessonIDs = lessonID ? [lessonID] : [];
    const quizIDs = quizID ? [quizID] : [];

    try {
        let certificate = await certificateModel.findOne({ course_id, user_id }).populate('course_id');
        
       
        if (certificate) {
            if (certificate.isCompleted == false) {
                if (certificate.lessonIDs.includes(lessonID)) {
                    return next(new APIERROR(400, "lesson already completed"));
                }
                if (certificate.quizIDs.includes(quizID)) {
                    return next(new APIERROR(400, "quiz already completed"));
                }
                lessonID && certificate.lessonIDs.push(lessonID);
                quizID && certificate.quizIDs.push(quizID);
                const lessons = await lessonModel.find({ course_id }).select("_id");
                const quizzes = await quizModel.find({ course_id }).select("_id");
                const lessonIds = lessons.map(lesson => lesson._id.toString());
                const quizIds = quizzes.map(quiz => quiz._id.toString());
                // console.log("lessonIds",lessonIds.toString());
                // console.log("quizIds",quizIds.toString());
                // console.log("certificate.quizIDs",certificate.quizIDs.toString());
                // console.log("certificate.lessonIDs",certificate.lessonIDs.toString());
                // console.log("check lesson",lessonIds.toString() === certificate.lessonIDs.toString());
                // console.log("check quiz",quizIds.toString() === certificate.quizIDs.toString());
                
                if (lessonIds.toString() === certificate.lessonIDs.toString() && quizIds.toString() === certificate.quizIDs.toString()) {
                    certificate.isCompleted = true;
                    const newMessage = await MessageModel.create({
                        senderId:certificate.course_id.instructor_id,
                        receiverId:user_id,
                        message: `congratulations you have completed the ${certificate.course_id.name.en} course`
                    })
                    const notification= await NotificationModel.create({
                        userId:user_id,
                        content: newMessage.message,
                        type: "message",
                        sender: certificate.course_id.instructor_id
                    })
                    const pusher = req.app.get('pusher');
                    await pusher.trigger(`chat-${user_id}`, 'newMessage', newMessage);

                    await pusher.trigger(`notification-${user_id}`, 'newNotification', notification);
                }

            } 
        }else {
            //  certificate=new certificateModel({course_id,user_id,lessonIDs:[lessonID],quizIDs:[quizID]});
            certificate = new certificateModel({
                course_id,
                user_id,
                lessonIDs,
                quizIDs
            });
        }
        await certificate.save();
        res.status(201).json({ status: "success", data: certificate })

    } catch (err) {
        return next(new APIERROR(400, err.message));
    }
};

// let updateCertificate = async function (req, res, next) {
//     try {
//         let certificate = await certificateModel.findByIdAndUpdate(req.params.id, req.body);

//         if (!certificate) {
//             return next(new APIERROR(404, "certificate not found"));
//         }

//         res.status(200).json(certificate)

//     } catch (err) {
//         return next(new APIERROR(400, err.message));
//     }
// };

let deleteCertificate = async function (req, res, next) {
    try {
        let certificate = await certificateModel.findByIdAndDelete(req.params.id);

        if (!certificate) {
            return next(new APIERROR(404, "certificate not found"));
        }

        res.status(200).json({ message: "succsse delete" })

    } catch (err) {
        return next(new APIERROR(400, err.message));
    }
};

module.exports = { getCertificates, getCertificateByCourseId, getCertificateByUserId, createAndUpdateCertificate, deleteCertificate }