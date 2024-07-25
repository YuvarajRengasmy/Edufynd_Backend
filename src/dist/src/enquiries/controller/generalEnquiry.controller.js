"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredGeneralEnquiry = exports.deleteGeneralEnquiry = exports.updateGeneralEnquiry = exports.createGeneralEnquiry = exports.getSingleGeneralEnquiry = exports.getAllGeneralEnquiry = void 0;
const generalEnquiry_model_1 = require("../model/generalEnquiry.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
var activity = "GeneralEnquiry";
let getAllGeneralEnquiry = async (req, res, next) => {
    try {
        const data = await generalEnquiry_model_1.GeneralEnquiry.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-General Enquiry', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-General Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllGeneralEnquiry = getAllGeneralEnquiry;
let getSingleGeneralEnquiry = async (req, res, next) => {
    try {
        const forex = await generalEnquiry_model_1.GeneralEnquiry.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-General Enquiry', true, 200, forex, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-General Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleGeneralEnquiry = getSingleGeneralEnquiry;
let createGeneralEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const contactDetails = req.body;
            const createData = new generalEnquiry_model_1.GeneralEnquiry(contactDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'General Enquiry-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'General Enquiry-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'General Enquiry-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createGeneralEnquiry = createGeneralEnquiry;
let updateGeneralEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails = req.body;
            const updateData = await generalEnquiry_model_1.GeneralEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    name: EnquiryDetails.name,
                    email: EnquiryDetails.email,
                    mobileNumber: EnquiryDetails.mobileNumber,
                    message: EnquiryDetails.message,
                    typeOfUser: EnquiryDetails.typeOfUser,
                    studentId: EnquiryDetails.studentId,
                    country: EnquiryDetails.country,
                    universityName: EnquiryDetails.universityName,
                    modifiedOn: new Date(),
                    modifiedBy: EnquiryDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-LoanEnquiryDetails', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateGeneralEnquiry = updateGeneralEnquiry;
let deleteGeneralEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const loan = await generalEnquiry_model_1.GeneralEnquiry.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-General Enquiry Details', true, 200, loan, 'Successfully Remove General Enquiry Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-General Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteGeneralEnquiry = deleteGeneralEnquiry;
let getFilteredGeneralEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.name) {
            andList.push({ name: req.body.name });
        }
        if (req.body.email) {
            andList.push({ email: req.body.email });
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const generalEnquiryList = await generalEnquiry_model_1.GeneralEnquiry.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const generalEnquiryCount = await generalEnquiry_model_1.GeneralEnquiry.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter General Enquiry', true, 200, { generalEnquiryList, generalEnquiryCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter General Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredGeneralEnquiry = getFilteredGeneralEnquiry;
//# sourceMappingURL=generalEnquiry.controller.js.map