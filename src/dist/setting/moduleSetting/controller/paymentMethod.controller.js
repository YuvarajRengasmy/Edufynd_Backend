"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredPaymentMethod = exports.deletePaymentMethod = exports.updatePaymentMethod = exports.createPaymentMethod = exports.getSinglePaymentMethod = exports.getAllPaymentMethod = void 0;
const paymentMethod_model_1 = require("../model/paymentMethod.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-All Module-Program-CourseType";
const getAllPaymentMethod = async (req, res) => {
    try {
        const data = await paymentMethod_model_1.PaymentMethod.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-PaymentMethod', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-PaymentMethod', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllPaymentMethod = getAllPaymentMethod;
const getSinglePaymentMethod = async (req, res) => {
    try {
        const data = await paymentMethod_model_1.PaymentMethod.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-PaymentMethod', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-PaymentMethod', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSinglePaymentMethod = getSinglePaymentMethod;
let createPaymentMethod = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new paymentMethod_model_1.PaymentMethod(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Payment Method', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Payment Method', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Payment Method', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createPaymentMethod = createPaymentMethod;
const updatePaymentMethod = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await paymentMethod_model_1.PaymentMethod.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.paymentMethod = DropdownListDetails.paymentMethod; // Assuming courseType is the only field being updated
        // Save the updated module
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-PaymentMethod', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-PaymentMethod', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updatePaymentMethod = updatePaymentMethod;
let deletePaymentMethod = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await paymentMethod_model_1.PaymentMethod.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the PaymentMethod', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the PaymentMethod', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deletePaymentMethod = deletePaymentMethod;
let getFilteredPaymentMethod = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.paymentMethod) {
            andList.push({ paymentMethod: req.body.paymentMethod });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await paymentMethod_model_1.PaymentMethod.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await paymentMethod_model_1.PaymentMethod.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Course Type', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Course Type', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredPaymentMethod = getFilteredPaymentMethod;
//# sourceMappingURL=paymentMethod.controller.js.map