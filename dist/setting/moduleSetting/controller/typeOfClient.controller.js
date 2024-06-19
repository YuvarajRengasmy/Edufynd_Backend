"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredTypeOfClient = exports.deleteTypeOfClient = exports.updateTypeOfClient = exports.createTypeOfClient = exports.getSingleTypeOfClient = exports.getAllTypeOfClient = void 0;
const typeOfClient_model_1 = require("../model/typeOfClient.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-All Module-Program-CourseType";
const getAllTypeOfClient = async (req, res) => {
    try {
        const data = await typeOfClient_model_1.TypeOfClient.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-TypeOfClient', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-TypeOfClient', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllTypeOfClient = getAllTypeOfClient;
const getSingleTypeOfClient = async (req, res) => {
    try {
        const data = await typeOfClient_model_1.TypeOfClient.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-TypeOfClient', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-TypeOfClient', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleTypeOfClient = getSingleTypeOfClient;
let createTypeOfClient = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new typeOfClient_model_1.TypeOfClient(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-TypeOfClient', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-TypeOfClient', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-TypeOfClient', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createTypeOfClient = createTypeOfClient;
const updateTypeOfClient = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await typeOfClient_model_1.TypeOfClient.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.typeOfClient = DropdownListDetails.typeOfClient; // Assuming courseType is the only field being updated
        // Save the updated module
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-TypeOfClient', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-TypeOfClient', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateTypeOfClient = updateTypeOfClient;
let deleteTypeOfClient = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await typeOfClient_model_1.TypeOfClient.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the TypeOfClient', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the TypeOfClient', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteTypeOfClient = deleteTypeOfClient;
let getFilteredTypeOfClient = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.typeOfClient) {
            andList.push({ typeOfClient: req.body.typeOfClient });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await typeOfClient_model_1.TypeOfClient.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await typeOfClient_model_1.TypeOfClient.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter TypeOfClient', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter TypeOfClient', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredTypeOfClient = getFilteredTypeOfClient;
//# sourceMappingURL=typeOfClient.controller.js.map