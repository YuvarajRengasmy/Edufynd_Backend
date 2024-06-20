"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredPopularCategory = exports.deletePopularCategory = exports.updatePopularCategory = exports.createPopularCategory = exports.getSinglePopularCategory = exports.getAllPopularCategory = void 0;
const popularCourse_model_1 = require("../model/popularCourse.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-DropDown Setting In All Module";
const getAllPopularCategory = async (req, res) => {
    try {
        const data = await popularCourse_model_1.PopularCategory.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-PopularCategory', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-PopularCategory', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllPopularCategory = getAllPopularCategory;
const getSinglePopularCategory = async (req, res) => {
    try {
        const data = await popularCourse_model_1.PopularCategory.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-PopularCategory', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-PopularCategory', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSinglePopularCategory = getSinglePopularCategory;
let createPopularCategory = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new popularCourse_model_1.PopularCategory(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-PopularCategory', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-PopularCategory', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-PopularCategory', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createPopularCategory = createPopularCategory;
const updatePopularCategory = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await popularCourse_model_1.PopularCategory.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.popularCategories = DropdownListDetails.popularCategories;
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-PopularCategory', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-PopularCategory', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updatePopularCategory = updatePopularCategory;
let deletePopularCategory = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await popularCourse_model_1.PopularCategory.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the PopularCategory', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the PopularCategory', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deletePopularCategory = deletePopularCategory;
let getFilteredPopularCategory = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.popularCategories) {
            andList.push({ popularCategories: req.body.popularCategories });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await popularCourse_model_1.PopularCategory.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await popularCourse_model_1.PopularCategory.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter PopularCategory', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter PopularCategory', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredPopularCategory = getFilteredPopularCategory;
