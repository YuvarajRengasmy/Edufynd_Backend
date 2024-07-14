import { Training, TrainingDocument } from './training.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Training";



export const getAllTraining = async (req, res) => {
    try {
        const data = await Training.find()
        response(req, res, activity, 'Level-1', 'GetAll-Training', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Training', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleTraining = async (req, res) => {
    try {
        const data = await Training.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Training', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Training', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createTraining = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: TrainingDocument = req.body;
            const createData = new Training(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Training', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Training', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Training', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateTraining = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const trainingData: TrainingDocument = req.body;
            let statusData = await Training.findByIdAndUpdate({_id: req.query._id }, {
                $set: {
                    requestTraining: trainingData.requestTraining,
                    trainingTopic: trainingData.trainingTopic,
                    date:trainingData.date,
                    time:trainingData.time,
                    typeOfUser: trainingData.typeOfUser,
                    usersName:trainingData.usersName,
                    material: trainingData.material,
                    name: trainingData.name,
                    subject: trainingData.subject,
                    content: trainingData.content,
                    uploadDocument: trainingData.uploadDocument,
                 
                    modifiedOn: new Date(),
                    modifiedBy:  trainingData.modifiedBy,
                },
              
            },{ new: true });

            response(req, res, activity, 'Level-2', 'Update-Training', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Training', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Training', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteTraining = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const data = await Training.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Training', true, 200, data, 'Successfully Remove Training');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Training', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredTraining   = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.typeOfUser) {
            andList.push({ typeOfUser: req.body.typeOfUser })
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject })
        }
        if (req.body.userName) {
            andList.push({ userName: req.body.userName })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const trainingList = await Training.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const trainingCount = await Training.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterTraining', true, 200, { trainingList, trainingCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterTraining', false, 500, {}, errorMessage.internalServer, err.message);
    }
};