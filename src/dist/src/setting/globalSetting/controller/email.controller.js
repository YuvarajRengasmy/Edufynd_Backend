"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredEmail = exports.deleteTemplate = exports.updateTemplate = exports.createEmailTemplate = exports.getSingleTemplate = exports.getAllEmailTemplate = void 0;
const email_model_1 = require("../../globalSetting/model/email.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "Global-Email-Template";
const getAllEmailTemplate = async (req, res) => {
    try {
        const data = await email_model_1.Email.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Email', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Email', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllEmailTemplate = getAllEmailTemplate;
const getSingleTemplate = async (req, res) => {
    try {
        const data = await email_model_1.Email.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Template', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Template', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleTemplate = getSingleTemplate;
let createEmailTemplate = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const templateData = req.body;
            const createData = new email_model_1.Email(templateData);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Email-Template', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Email-Template', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Email-Template', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createEmailTemplate = createEmailTemplate;
const updateTemplate = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const templateData = req.body;
            let statusData = await email_model_1.Email.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    subject: templateData.subject,
                    content: templateData.content,
                    modifiedOn: new Date(),
                    modifiedBy: templateData.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Template Data', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Template Data', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Template Data', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateTemplate = updateTemplate;
let deleteTemplate = async (req, res, next) => {
    try {
        let id = req.query._id;
        const email = await email_model_1.Email.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted this Status', true, 200, email, 'Successfully Remove the Template');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted this Status', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteTemplate = deleteTemplate;
let getFilteredEmail = async (req, res, next) => {
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
        const emailList = await email_model_1.Email.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const emailCount = await email_model_1.Email.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterEmail', true, 200, { emailList, emailCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterEmail', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredEmail = getFilteredEmail;
//# sourceMappingURL=email.controller.js.map