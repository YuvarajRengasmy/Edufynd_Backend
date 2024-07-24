"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredStatus = exports.deleteStatus = exports.updateStatus = exports.createStatus = exports.getSingleStatus = exports.getAllStatus = void 0;
const status_model_1 = require("../../globalSetting/model/status.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "Global Status";
const getAllStatus = async (req, res) => {
    try {
        const data = await status_model_1.Status.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Status', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Status', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllStatus = getAllStatus;
const getSingleStatus = async (req, res) => {
    try {
        const data = await status_model_1.Status.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Status', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Status', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleStatus = getSingleStatus;
let createStatus = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails = req.body;
            const createData = new status_model_1.Status(statusDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Status', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Status', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Status', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createStatus = createStatus;
const updateStatus = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails = req.body;
            const statusData = await status_model_1.Status.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    statusName: statusDetails.statusName,
                    duration: statusDetails.duration,
                    modifiedOn: new Date(),
                    modifiedBy: statusDetails.modifiedBy,
                },
            }, { new: true });
            if (!statusData) {
                return (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Status Details', false, 404, {}, 'Status not found');
            }
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Status Details', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            console.log("Error updating status:", err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Status Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Status Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateStatus = updateStatus;
let deleteStatus = async (req, res, next) => {
    try {
        let id = req.query._id;
        const staff = await status_model_1.Status.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted this Status', true, 200, staff, 'Successfully Remove Status');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted this Status', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteStatus = deleteStatus;
let getFilteredStatus = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.statusName) {
            andList.push({ statusName: req.body.statusName });
        }
        if (req.body.duration) {
            andList.push({ duration: req.body.duration });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const statusList = await status_model_1.Status.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const statusCount = await status_model_1.Status.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterStatus', true, 200, { statusList, statusCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterStatus', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredStatus = getFilteredStatus;
//# sourceMappingURL=status.controller.js.map