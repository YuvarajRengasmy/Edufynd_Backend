"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredForexEnquiry = exports.deleteForexEnquiry = exports.updateForexEnquiry = exports.createForexEnquiry = exports.getSingleForexEnquiry = exports.getAllForexEnquiry = void 0;
const forex_model_1 = require("../model/forex.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
var activity = "ForexEnquiry";
let getAllForexEnquiry = async (req, res, next) => {
    try {
        const data = await forex_model_1.Forex.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Forex Enquiry', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Forex Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllForexEnquiry = getAllForexEnquiry;
let getSingleForexEnquiry = async (req, res, next) => {
    try {
        const forex = await forex_model_1.Forex.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Forex Enquiry', true, 200, forex, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Forex Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleForexEnquiry = getSingleForexEnquiry;
const generateNextForexId = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const forex = await forex_model_1.Forex.find({}, 'forexID').exec();
    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.forexID;
        const parts = appCode.split('_');
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10);
            return counter > max ? counter : max;
        }
        return max;
    }, 100);
    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `EF_${formattedCounter}`;
};
let createForexEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const forexDetails = req.body;
            forexDetails.createdOn = new Date();
            forexDetails.forexID = await generateNextForexId();
            const createData = new forex_model_1.Forex(forexDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Forex Enquiry-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Forex Enquiry-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Forex Enquiry-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createForexEnquiry = createForexEnquiry;
let updateForexEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const forexEnquiryDetails = req.body;
            const updateData = await forex_model_1.Forex.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    source: forexEnquiryDetails.source,
                    studentName: forexEnquiryDetails.studentName,
                    country: forexEnquiryDetails.country,
                    currency: forexEnquiryDetails.currency,
                    universityName: forexEnquiryDetails.universityName,
                    passportNo: forexEnquiryDetails.passportNo,
                    whatsAppNumber: forexEnquiryDetails.whatsAppNumber,
                    //If Agent request for the following
                    agentName: forexEnquiryDetails.agentName,
                    businessName: forexEnquiryDetails.businessName,
                    agentPrimaryNumber: forexEnquiryDetails.agentPrimaryNumber,
                    agentWhatsAppNumber: forexEnquiryDetails.agentWhatsAppNumber,
                    agentEmail: forexEnquiryDetails.agentEmail,
                    paymentType: forexEnquiryDetails.paymentType,
                    amountInCurrency: forexEnquiryDetails.amountInCurrency,
                    assignedTo: forexEnquiryDetails.assignedTo,
                    message: forexEnquiryDetails.message,
                    studentId: forexEnquiryDetails.studentId,
                    // New added Fields
                    expiryDate: forexEnquiryDetails.expiryDate,
                    courseType: forexEnquiryDetails.courseType,
                    value: forexEnquiryDetails.value,
                    markUp: forexEnquiryDetails.markUp,
                    profit: forexEnquiryDetails.profit,
                    modifiedOn: new Date(),
                    modifiedBy: forexEnquiryDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Forex Enquiry Details', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Forex Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Forex Enquiry Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateForexEnquiry = updateForexEnquiry;
let deleteForexEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const loan = await forex_model_1.Forex.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Forex Enquiry Details', true, 200, loan, 'Successfully Remove Forex Enquiry Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Forex Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteForexEnquiry = deleteForexEnquiry;
let getFilteredForexEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName });
        }
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName });
        }
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName });
        }
        if (req.body.email) {
            andList.push({ email: req.body.email });
        }
        if (req.body.paymentType) {
            andList.push({ paymentType: req.body.paymentType });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const forexList = await forex_model_1.Forex.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const forexCount = await forex_model_1.Forex.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Forex Enquiry', true, 200, { forexList, forexCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Forex Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredForexEnquiry = getFilteredForexEnquiry;
//# sourceMappingURL=forex.controller.js.map