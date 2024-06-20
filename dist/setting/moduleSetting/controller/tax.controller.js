"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredTax = exports.deleteTax = exports.updateTax = exports.createTax = exports.getSingleTax = exports.getAllTax = void 0;
const tax_model_1 = require("../model/tax.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-All Module-Program-CourseType";
const getAllTax = async (req, res) => {
    try {
        const data = await tax_model_1.Tax.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Tax', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Tax', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllTax = getAllTax;
const getSingleTax = async (req, res) => {
    try {
        const data = await tax_model_1.Tax.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Tax', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Tax', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleTax = getSingleTax;
let createTax = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new tax_model_1.Tax(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Tax', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Tax', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Tax', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createTax = createTax;
const updateTax = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await tax_model_1.Tax.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.tax = DropdownListDetails.tax; // Assuming courseType is the only field being updated
        // Save the updated module
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-CourseTypeList', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-CourseTypeList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateTax = updateTax;
let deleteTax = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await tax_model_1.Tax.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Tax', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Tax', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteTax = deleteTax;
let getFilteredTax = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await tax_model_1.Tax.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await tax_model_1.Tax.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Tax', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Tax', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredTax = getFilteredTax;
