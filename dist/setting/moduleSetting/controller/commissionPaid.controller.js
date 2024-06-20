"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCommissionPaid = exports.deleteCommissionPaid = exports.updateCommissionPaid = exports.createCommissionPaid = exports.getSingleCommissionPaid = exports.getAllCommissionPaid = void 0;
const commissionPaid_model_1 = require("../model/commissionPaid.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-DropDown Setting In All Module";
const getAllCommissionPaid = async (req, res) => {
    try {
        const data = await commissionPaid_model_1.CommissionPaid.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-CommissionPaid', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-CommissionPaid', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCommissionPaid = getAllCommissionPaid;
const getSingleCommissionPaid = async (req, res) => {
    try {
        const data = await commissionPaid_model_1.CommissionPaid.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-CommissionPaid', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-CommissionPaid', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCommissionPaid = getSingleCommissionPaid;
let createCommissionPaid = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new commissionPaid_model_1.CommissionPaid(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-CommissionPaid', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-CommissionPaid', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-CommissionPaid', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createCommissionPaid = createCommissionPaid;
const updateCommissionPaid = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await commissionPaid_model_1.CommissionPaid.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.commissionPaidOn = DropdownListDetails.commissionPaidOn;
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-CommissionPaid', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-CommissionPaid', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateCommissionPaid = updateCommissionPaid;
let deleteCommissionPaid = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await commissionPaid_model_1.CommissionPaid.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the CommissionPaid', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the CommissionPaid', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCommissionPaid = deleteCommissionPaid;
let getFilteredCommissionPaid = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.commissionPaidOn) {
            andList.push({ commissionPaidOn: req.body.commissionPaidOn });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await commissionPaid_model_1.CommissionPaid.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await commissionPaid_model_1.CommissionPaid.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter CommissionPaid', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter CommissionPaid', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCommissionPaid = getFilteredCommissionPaid;
