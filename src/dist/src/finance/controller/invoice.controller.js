"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredInvoice = exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = exports.getSingleInvoice = exports.getAllInvoice = void 0;
const invoice_model_1 = require("../model/invoice.model");
const receiverInvoice_model_1 = require("../model/receiverInvoice.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
const number_to_words_1 = require("number-to-words");
var activity = "Invoice";
let getAllInvoice = async (req, res, next) => {
    try {
        const data = await invoice_model_1.Invoice.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Invoice', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllInvoice = getAllInvoice;
let getSingleInvoice = async (req, res, next) => {
    try {
        const invoice = await invoice_model_1.Invoice.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Invoice', true, 200, invoice, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleInvoice = getSingleInvoice;
const generateReceiverInvoice = async () => {
    // Retrieve all IDs to determine the highest existing applicant counter
    const invoice = await invoice_model_1.Invoice.find({}, 'invoiceNumber').exec();
    const maxCounter = invoice.reduce((max, app) => {
        const appCode = app.invoiceNumber;
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
    return `INV_${formattedCounter}`;
};
let createInvoice = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails = req.body;
            // Populate the ReceiverId field to get the Receiver Invoice document
            const receiverInvoice = await receiverInvoice_model_1.ReceiverInvoice.findById(invoiceDetails.receiverId);
            if (!receiverInvoice) {
                return (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Receiver Invoice Not Found', false, 404, {}, "Not Found the ID's");
            }
            let rate = receiverInvoice.amount;
            // Calculation of GST
            invoiceDetails.commissionReceived = rate;
            let withoutGST = rate / (118 * 100);
            let tds = withoutGST * (5 / 100);
            let netValue = withoutGST - tds;
            receiverInvoice.netInWords = (0, number_to_words_1.toWords)(netValue).replace(/,/g, '') + ' only';
            const createData = new invoice_model_1.Invoice(receiverInvoice);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Receiver Invoice-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createInvoice = createInvoice;
let updateInvoice = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails = req.body;
            const updateData = await invoice_model_1.Invoice.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    tax: invoiceDetails.tax,
                    gst: invoiceDetails.gst,
                    tds: invoiceDetails.tds,
                    clientName: invoiceDetails.clientName,
                    INRValue: invoiceDetails.INRValue,
                    agentName: invoiceDetails.agentName,
                    applicationID: invoiceDetails.applicationID,
                    universityName: invoiceDetails.universityName,
                    commissionReceived: invoiceDetails.commissionReceived,
                    amountPaid: invoiceDetails.amountPaid,
                    totalInvoiceAmount: invoiceDetails.totalInvoiceAmount,
                    transactions: invoiceDetails.transactions,
                    transactionsDate: invoiceDetails.transactionsDate,
                    amount: invoiceDetails.amount,
                    paymentMethod: invoiceDetails.paymentMethod,
                    modifiedOn: new Date(),
                    modifiedBy: invoiceDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Invoice Details', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Invoice Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Invoice Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateInvoice = updateInvoice;
let deleteInvoice = async (req, res, next) => {
    try {
        let id = req.query._id;
        const invoice = await invoice_model_1.Invoice.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Invoice Details', true, 200, invoice, 'Successfully Remove Invoice Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Invoice Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteInvoice = deleteInvoice;
let getFilteredInvoice = async (req, res, next) => {
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
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName });
        }
        if (req.body.applicationID) {
            andList.push({ applicationID: req.body.applicationID });
        }
        if (req.body.commission) {
            andList.push({ commission: req.body.commission });
        }
        if (req.body.paymentMethod) {
            andList.push({ paymentMethod: req.body.paymentMethod });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const invoiceList = await invoice_model_1.Invoice.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const invoiceCount = await invoice_model_1.Invoice.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Invoice', true, 200, { invoiceList, invoiceCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredInvoice = getFilteredInvoice;
//# sourceMappingURL=invoice.controller.js.map