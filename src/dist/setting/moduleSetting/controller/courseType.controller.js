"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCourseType = exports.deleteCourseType = exports.updateCourseTypeList = exports.createCourseType = exports.getSingleCourseTypeList = exports.getAllCourseTypeList = void 0;
const courseType_model_1 = require("../model/courseType.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-All Module-Program-CourseType";
const getAllCourseTypeList = async (req, res) => {
    try {
        const data = await courseType_model_1.CourseTypeList.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Course Type', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Course Type', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCourseTypeList = getAllCourseTypeList;
const getSingleCourseTypeList = async (req, res) => {
    try {
        const data = await courseType_model_1.CourseTypeList.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Course Type', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Course Type', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCourseTypeList = getSingleCourseTypeList;
let createCourseType = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new courseType_model_1.CourseTypeList(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Course Type', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Course Type', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Course Type', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createCourseType = createCourseType;
const updateCourseTypeList = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await courseType_model_1.CourseTypeList.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.courseType = DropdownListDetails.courseType; // Assuming courseType is the only field being updated
        // Save the updated module
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-CourseTypeList', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-CourseTypeList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateCourseTypeList = updateCourseTypeList;
let deleteCourseType = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await courseType_model_1.CourseTypeList.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Course Type', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Course Type', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCourseType = deleteCourseType;
let getFilteredCourseType = async (req, res, next) => {
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
        const dropDownList = await courseType_model_1.CourseTypeList.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await courseType_model_1.CourseTypeList.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Course Type', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Course Type', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCourseType = getFilteredCourseType;
//# sourceMappingURL=courseType.controller.js.map