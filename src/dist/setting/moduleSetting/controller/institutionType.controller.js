"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredInstitutionType = exports.deleteInstitutionType = exports.updateInstitutionType = exports.createInstitutionType = exports.getSingleInstitutionType = exports.getAllInstitutionType = void 0;
const institiutionType_model_1 = require("../model/institiutionType.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-All Module-Program-CourseType";
const getAllInstitutionType = async (req, res) => {
    try {
        const data = await institiutionType_model_1.InstitutionType.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-InstitutionType', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-InstitutionType', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllInstitutionType = getAllInstitutionType;
const getSingleInstitutionType = async (req, res) => {
    try {
        const data = await institiutionType_model_1.InstitutionType.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-InstitutionType', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-InstitutionType', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleInstitutionType = getSingleInstitutionType;
let createInstitutionType = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new institiutionType_model_1.InstitutionType(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-InstitutionType', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-InstitutionType', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-InstitutionType', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createInstitutionType = createInstitutionType;
const updateInstitutionType = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await institiutionType_model_1.InstitutionType.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.institutionType = DropdownListDetails.institutionType; // Assuming courseType is the only field being updated
        // Save the updated module
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-InstitutionType', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-InstitutionType', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateInstitutionType = updateInstitutionType;
let deleteInstitutionType = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await institiutionType_model_1.InstitutionType.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the InstitutionType', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the InstitutionType', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteInstitutionType = deleteInstitutionType;
let getFilteredInstitutionType = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.institutionType) {
            andList.push({ courseType: req.body.institutionType });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await institiutionType_model_1.InstitutionType.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await institiutionType_model_1.InstitutionType.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter InstitutionType', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter InstitutionType', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredInstitutionType = getFilteredInstitutionType;
//# sourceMappingURL=institutionType.controller.js.map