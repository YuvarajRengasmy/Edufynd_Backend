"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCountry = exports.deleteCountry = exports.updateCountry = exports.createCountry = exports.getSingleCountry = exports.getAllCountry = void 0;
const country_model_1 = require("../../globalSetting/model/country.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "Global-Country";
const getAllCountry = async (req, res) => {
    try {
        const data = await country_model_1.Country.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Country', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Country', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCountry = getAllCountry;
const getSingleCountry = async (req, res) => {
    try {
        const data = await country_model_1.Country.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Country', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Country', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCountry = getSingleCountry;
let createCountry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const countryDetails = req.body;
            const createData = new country_model_1.Country(countryDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Country', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Country', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Country', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createCountry = createCountry;
const updateCountry = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const countryDetails = req.body;
            let statusData = await country_model_1.Country.findByIdAndUpdate({ _id: countryDetails._id }, {
                $set: {
                    country: countryDetails.country,
                    modifiedOn: countryDetails.modifiedOn,
                    modifiedBy: countryDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Country Details', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Country Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Country Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateCountry = updateCountry;
let deleteCountry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await country_model_1.Country.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Country', true, 200, country, 'Successfully Remove Country');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Country', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCountry = deleteCountry;
let getFilteredCountry = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.country) {
            andList.push({ country: req.body.country });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const countryList = await country_model_1.Country.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const countryCount = await country_model_1.Country.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterCountry', true, 200, { countryList, countryCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterCountry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCountry = getFilteredCountry;
//# sourceMappingURL=country.controller.js.map