"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredBusinessEnquiry = exports.deleteBusinessEnquiry = exports.updateBusinessEnquiry = exports.createBusinessEnquiry = exports.getSingleBusinessEnquiry = exports.getAllBusinessEnquiry = void 0;
const businessEnquiry_model_1 = require("../model/businessEnquiry.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
var activity = "BusinessEnquiry";
let getAllBusinessEnquiry = async (req, res, next) => {
    try {
        const data = await businessEnquiry_model_1.BusinessEnquiry.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Business Enquiry', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Business Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllBusinessEnquiry = getAllBusinessEnquiry;
let getSingleBusinessEnquiry = async (req, res, next) => {
    try {
        const data = await businessEnquiry_model_1.BusinessEnquiry.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Business Enquiry', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Business Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleBusinessEnquiry = getSingleBusinessEnquiry;
let createBusinessEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const contactDetails = req.body;
            const createData = new businessEnquiry_model_1.BusinessEnquiry(contactDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Business Enquiry-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Business Enquiry-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Business Enquiry-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createBusinessEnquiry = createBusinessEnquiry;
let updateBusinessEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails = req.body;
            const updateData = await businessEnquiry_model_1.BusinessEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    name: EnquiryDetails.name,
                    email: EnquiryDetails.email,
                    mobileNumber: EnquiryDetails.mobileNumber,
                    message: EnquiryDetails.message,
                    studentId: EnquiryDetails.studentId,
                    country: EnquiryDetails.country,
                    universityName: EnquiryDetails.universityName,
                    modifiedOn: new Date(),
                    modifiedBy: EnquiryDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Business Enquiry Details', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Business Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Business Enquiry Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateBusinessEnquiry = updateBusinessEnquiry;
let deleteBusinessEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await businessEnquiry_model_1.BusinessEnquiry.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Business Enquiry Details', true, 200, data, 'Successfully Remove Business Enquiry Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Business Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteBusinessEnquiry = deleteBusinessEnquiry;
let getFilteredBusinessEnquiry = async (req, res, next) => {
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
        const businessEnquiryList = await businessEnquiry_model_1.BusinessEnquiry.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const businessEnquiryCount = await businessEnquiry_model_1.BusinessEnquiry.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Business Enquiry', true, 200, { businessEnquiryList, businessEnquiryCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Business Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredBusinessEnquiry = getFilteredBusinessEnquiry;
//# sourceMappingURL=businessEnquiry.controller.js.map