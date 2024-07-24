"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredTraining = exports.deleteTraining = exports.updateTraining = exports.createTraining = exports.getSingleTraining = exports.getAllTraining = void 0;
const training_model_1 = require("./training.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Training";
const getAllTraining = async (req, res) => {
    try {
        const data = await training_model_1.Training.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Training', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Training', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllTraining = getAllTraining;
const getSingleTraining = async (req, res) => {
    try {
        const data = await training_model_1.Training.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Training', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Training', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleTraining = getSingleTraining;
let createTraining = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const Data = req.body;
            const createData = new training_model_1.Training(Data);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Training', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Training', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Training', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createTraining = createTraining;
const updateTraining = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const trainingData = req.body;
            let statusData = await training_model_1.Training.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    requestTraining: trainingData.requestTraining,
                    trainingTopic: trainingData.trainingTopic,
                    date: trainingData.date,
                    time: trainingData.time,
                    typeOfUser: trainingData.typeOfUser,
                    usersName: trainingData.usersName,
                    material: trainingData.material,
                    name: trainingData.name,
                    subject: trainingData.subject,
                    content: trainingData.content,
                    uploadDocument: trainingData.uploadDocument,
                    modifiedOn: new Date(),
                    modifiedBy: trainingData.modifiedBy,
                },
            }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Training', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Training', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Training', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateTraining = updateTraining;
let deleteTraining = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await training_model_1.Training.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Training', true, 200, data, 'Successfully Remove Training');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Training', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteTraining = deleteTraining;
let getFilteredTraining = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.typeOfUser) {
            andList.push({ typeOfUser: req.body.typeOfUser });
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject });
        }
        if (req.body.userName) {
            andList.push({ userName: req.body.userName });
        }
        if (req.body.content) {
            andList.push({ content: req.body.content });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const trainingList = await training_model_1.Training.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const trainingCount = await training_model_1.Training.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterTraining', true, 200, { trainingList, trainingCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterTraining', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredTraining = getFilteredTraining;
//# sourceMappingURL=training.controller.js.map