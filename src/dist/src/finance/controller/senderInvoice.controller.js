"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredSenderInvoice = exports.deleteSenderInvoice = exports.updateSenderInvoice = exports.createSenderInvoice = exports.getSingleSenderInvoice = exports.getAllSenderInvoice = void 0;
const senderInvoice_model_1 = require("../model/senderInvoice.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
const number_to_words_1 = require("number-to-words");
var activity = "Sender Invoice";
let getAllSenderInvoice = async (req, res, next) => {
    try {
        const data = await senderInvoice_model_1.SenderInvoice.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Sender Invoice', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Sender Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllSenderInvoice = getAllSenderInvoice;
let getSingleSenderInvoice = async (req, res, next) => {
    try {
        const invoice = await senderInvoice_model_1.SenderInvoice.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Sender Invoice', true, 200, invoice, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Sender Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleSenderInvoice = getSingleSenderInvoice;
const generateSenderInvoice = async () => {
    // Retrieve all IDs to determine the highest existing applicant counter
    const forex = await senderInvoice_model_1.SenderInvoice.find({}, 'senderInvoiceNumber').exec();
    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.senderInvoiceNumber;
        const parts = appCode.split('_');
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10);
            return counter > max ? counter : max;
        }
        return max;
    }, 0);
    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `SINV_${formattedCounter}`;
};
let createSenderInvoice = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails = req.body;
            invoiceDetails.createdOn = new Date();
            invoiceDetails.senderInvoiceNumber = await generateSenderInvoice();
            let final, courseValue, paidValue, fixedValue;
            if (invoiceDetails.paymentMethod === "CourseFees") {
                let afterScholarship = Number(invoiceDetails.courseFeesAmount) - (invoiceDetails.scholarshipAmount ? invoiceDetails.scholarshipAmount : 0);
                final = afterScholarship * (invoiceDetails.courseFeesPercentage / 100);
            }
            if (invoiceDetails.paymentMethod === "PaidFees") {
                final = Number(invoiceDetails.paidFeesAmount) * (invoiceDetails.paidFeesPercentage / 100);
            }
            if (invoiceDetails.paymentMethod === "Fixed") {
                final = Number(invoiceDetails.fixedAmount);
            }
            // invoiceDetails.netAmount = courseValue ?? paidValue ?? fixedValue ?? 0
            final = parseFloat(final.toFixed(2));
            invoiceDetails.amountReceivedInCurrency = final;
            let rate = invoiceDetails.amountReceivedInINR / final;
            invoiceDetails.netAmount = rate;
            invoiceDetails.netInWords = (0, number_to_words_1.toWords)(rate).replace(/,/g, '') + ' only';
            const createData = new senderInvoice_model_1.SenderInvoice(invoiceDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Sender Invoice-Created', true, 200, insertData, ErrorMessage_1.clientError.success.Sinvoice);
        }
        catch (err) {
            console.log(err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createSenderInvoice = createSenderInvoice;
let updateSenderInvoice = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails = req.body;
            const updateData = await senderInvoice_model_1.SenderInvoice.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    tax: invoiceDetails.tax,
                    gst: invoiceDetails.gst,
                    tds: invoiceDetails.tds,
                    businessName: invoiceDetails.businessName,
                    universityName: invoiceDetails.universityName,
                    applicationID: invoiceDetails.applicationID,
                    currency: invoiceDetails.currency,
                    commission: invoiceDetails.commission,
                    amountReceivedInCurrency: invoiceDetails.amountReceivedInCurrency,
                    amountReceivedInINR: invoiceDetails.amountReceivedInINR,
                    // INRValue: invoiceDetails.INRValue,    
                    date: invoiceDetails.date,
                    modifiedOn: new Date(),
                    modifiedBy: invoiceDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Sender Invoice Details', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Sender Invoice Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Sender Invoice Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateSenderInvoice = updateSenderInvoice;
let deleteSenderInvoice = async (req, res, next) => {
    try {
        let id = req.query._id;
        const invoice = await senderInvoice_model_1.SenderInvoice.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Sender InvoiceDetails', true, 200, invoice, 'Successfully Remove Sender Invoice Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Sender Invoice Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteSenderInvoice = deleteSenderInvoice;
let getFilteredSenderInvoice = async (req, res, next) => {
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
        if (req.body.clientName) {
            andList.push({ clientName: req.body.clientName });
        }
        if (req.body.applicationID) {
            andList.push({ applicationID: req.body.applicationID });
        }
        if (req.body.currency) {
            andList.push({ currency: req.body.currency });
        }
        if (req.body.INRValue) {
            andList.push({ INRValue: req.body.INRValue });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const invoiceList = await senderInvoice_model_1.SenderInvoice.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const invoiceCount = await senderInvoice_model_1.SenderInvoice.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Sender Invoice', true, 200, { invoiceList, invoiceCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Sender Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredSenderInvoice = getFilteredSenderInvoice;
//# sourceMappingURL=senderInvoice.controller.js.map