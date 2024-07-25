"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredYear = exports.deleteYear = exports.updateYear = exports.createYear = exports.getSingleYear = exports.getAllYear = void 0;
const year_model_1 = require("../../globalSetting/model/year.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "Global-Year";
const getAllYear = async (req, res) => {
    try {
        const data = await year_model_1.Year.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Year', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Year', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllYear = getAllYear;
const getSingleYear = async (req, res) => {
    try {
        const data = await year_model_1.Year.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Year', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Year', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleYear = getSingleYear;
let createYear = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const yearDetails = req.body;
            const createData = new year_model_1.Year(yearDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Year', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Year', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Year', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createYear = createYear;
const updateYear = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const yearDetails = req.body;
            const yearData = await year_model_1.Year.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    year: yearDetails.year,
                    modifiedOn: new Date(),
                    modifiedBy: yearDetails.modifiedBy,
                },
            }, { new: true });
            if (!yearData) {
                return (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Year Details', false, 404, {}, 'Year not found');
            }
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Year Details', true, 200, yearData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            console.log("Error updating status:", err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Year Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Year Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateYear = updateYear;
let deleteYear = async (req, res, next) => {
    try {
        let id = req.query._id;
        const year = await year_model_1.Year.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted this Year', true, 200, year, 'Successfully Remove Year');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted this Year', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteYear = deleteYear;
let getFilteredYear = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.year) {
            andList.push({ year: req.body.year });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const yearList = await year_model_1.Year.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const yearCount = await year_model_1.Year.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter-Year', true, 200, { yearList, yearCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter-Year', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredYear = getFilteredYear;
//# sourceMappingURL=year.controller.js.map