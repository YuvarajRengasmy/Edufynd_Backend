"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredInTake = exports.deleteInTake = exports.updateInTake = exports.createInTake = exports.getSingleInTake = exports.getAllInTake = void 0;
const intake_model_1 = require("../../globalSetting/model/intake.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "Global-InTake";
const getAllInTake = async (req, res) => {
    try {
        const data = await intake_model_1.InTake.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-InTake', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-InTake', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllInTake = getAllInTake;
const getSingleInTake = async (req, res) => {
    try {
        const data = await intake_model_1.InTake.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-InTake', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-InTake', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleInTake = getSingleInTake;
let createInTake = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const intakeData = req.body;
            const createData = new intake_model_1.InTake(intakeData);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-InTake', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-InTake', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-InTake', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createInTake = createInTake;
const updateInTake = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const intakeData = req.body;
            let statusData = await intake_model_1.InTake.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    intakeName: intakeData.intakeName,
                    startDate: intakeData.startDate,
                    endDate: intakeData.endDate,
                    modifiedOn: new Date(),
                    modifiedBy: intakeData.modifiedBy,
                },
            }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-InTakeData', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-InTakeData', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-InTakeData', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateInTake = updateInTake;
let deleteInTake = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await intake_model_1.InTake.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted this InTake', true, 200, data, 'Successfully Remove InTake');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted this InTake', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteInTake = deleteInTake;
let getFilteredInTake = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.from) {
            andList.push({ from: req.body.from });
        }
        if (req.body.to) {
            andList.push({ to: req.body.to });
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject });
        }
        if (req.body.content) {
            andList.push({ content: req.body.content });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const intakeList = await intake_model_1.InTake.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const intakeCount = await intake_model_1.InTake.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterInTak', true, 200, { intakeList, intakeCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterInTake', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredInTake = getFilteredInTake;
//# sourceMappingURL=intake.controller.js.map