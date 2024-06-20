"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCurrency = exports.deleteCurrency = exports.createCurrency = exports.getSingleCurrency = exports.getAllCurrency = void 0;
const currency_model_1 = require("../../globalSetting/model/currency.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "Global-Currency";
const getAllCurrency = async (req, res) => {
    try {
        const data = await currency_model_1.Currency.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Currency', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Currency', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCurrency = getAllCurrency;
const getSingleCurrency = async (req, res) => {
    try {
        const data = await currency_model_1.Currency.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Currency', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Currency', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCurrency = getSingleCurrency;
let createCurrency = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const currencyDetails = req.body;
            const createData = new currency_model_1.Currency(currencyDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Currency', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Currency', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Currency', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createCurrency = createCurrency;
let deleteCurrency = async (req, res, next) => {
    try {
        let id = req.query._id;
        const currency = await currency_model_1.Currency.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Currency', true, 200, currency, 'Successfully Remove Currency');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Currency', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCurrency = deleteCurrency;
let getFilteredCurrency = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.currency) {
            andList.push({ currency: req.body.currency });
        }
        if (req.body.flag) {
            andList.push({ flag: req.body.flag });
        }
        if (req.body.country) {
            andList.push({ country: req.body.country });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const currencyList = await currency_model_1.Currency.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const currencyCount = await currency_model_1.Currency.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterCurrency', true, 200, { currencyList, currencyCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterCurrency', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCurrency = getFilteredCurrency;
