"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredReceiverInvoice = exports.deleteReceiverInvoice = exports.updateReceiverInvoice = exports.createReceiverInvoice = exports.getSingleReceiverInvoice = exports.getAllReceiverInvoice = void 0;
const receiverInvoice_model_1 = require("../model/receiverInvoice.model");
const senderInvoice_model_1 = require("../model/senderInvoice.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
const number_to_words_1 = require("number-to-words");
var activity = "Receiver Invoice";
let getAllReceiverInvoice = async (req, res, next) => {
    try {
        const data = await receiverInvoice_model_1.ReceiverInvoice.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Receiver Invoice', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Receiver Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllReceiverInvoice = getAllReceiverInvoice;
let getSingleReceiverInvoice = async (req, res, next) => {
    try {
        const invoice = await receiverInvoice_model_1.ReceiverInvoice.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Receiver Invoice', true, 200, invoice, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Receiver Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleReceiverInvoice = getSingleReceiverInvoice;
const generateReceiverInvoice = async () => {
    // Retrieve all IDs to determine the highest existing applicant counter
    const invoice = await receiverInvoice_model_1.ReceiverInvoice.find({}, 'receiverInvoiceNumber').exec();
    const maxCounter = invoice.reduce((max, app) => {
        const appCode = app.receiverInvoiceNumber;
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
    return `RINV_${formattedCounter}`;
};
let createReceiverInvoice = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const receiverInvoiceDetails = req.body;
            // Populate the senderId field to get the senderInvoice document
            const senderInvoice = await senderInvoice_model_1.SenderInvoice.findById(receiverInvoiceDetails.senderId);
            if (!senderInvoice) {
                return (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Sender Invoice Not Found', false, 404, {}, "Not Found the Amount");
            }
            // Assign netAmount from senderInvoice to amountPaid in receiverInvoice
            let percent = senderInvoice.amountReceivedInCurrency;
            //  let rate = INR/Currency
            let currencyAmount = percent * (receiverInvoiceDetails.commission / 100);
            receiverInvoiceDetails.amountInCurrency = currencyAmount;
            let INR = receiverInvoiceDetails.amountInINR / currencyAmount;
            receiverInvoiceDetails.amount = INR;
            // Calculation of GST
            let commissionReceived = receiverInvoiceDetails.amountInINR;
            let withoutGST = commissionReceived / (118 * 100);
            let tds = withoutGST * (5 / 100);
            let netValue = withoutGST - tds;
            receiverInvoiceDetails.netInWords = (0, number_to_words_1.toWords)(netValue).replace(/,/g, '') + ' only';
            const createData = new receiverInvoice_model_1.ReceiverInvoice(receiverInvoiceDetails);
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
exports.createReceiverInvoice = createReceiverInvoice;
// export let createReceiverInvoice = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const invoiceDetails: ReceiverInvoiceDocument = req.body;
//             invoiceDetails.createdOn = new Date();
//             invoiceDetails.invoiceNumber = await generateReceiverInvoice()
//             invoiceDetails.amountPaid = Number(Number(invoiceDetails.commission)/100) * invoiceDetails.amountPaid
//             const createData = new ReceiverInvoice(invoiceDetails);
//             let insertData = await createData.save();
//             response(req, res, activity, 'Level-2', 'Receiver Invoice-Created', true, 200, insertData, clientError.success.registerSuccessfully);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }
let updateReceiverInvoice = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails = req.body;
            const updateData = await receiverInvoice_model_1.ReceiverInvoice.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    tax: invoiceDetails.tax,
                    gst: invoiceDetails.gst,
                    tds: invoiceDetails.tds,
                    agentName: invoiceDetails.agentName,
                    applicationID: invoiceDetails.applicationID,
                    universityName: invoiceDetails.universityName,
                    commission: invoiceDetails.commission,
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
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Receiver Invoice Details', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Receiver Invoice Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Receiver Invoice Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateReceiverInvoice = updateReceiverInvoice;
let deleteReceiverInvoice = async (req, res, next) => {
    try {
        let id = req.query._id;
        const invoice = await receiverInvoice_model_1.ReceiverInvoice.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Receiver Invoice Details', true, 200, invoice, 'Successfully Remove Receiver Invoice Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Receiver Invoice Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteReceiverInvoice = deleteReceiverInvoice;
let getFilteredReceiverInvoice = async (req, res, next) => {
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
        const invoiceList = await receiverInvoice_model_1.ReceiverInvoice.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const invoiceCount = await receiverInvoice_model_1.ReceiverInvoice.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Receiver Invoice', true, 200, { invoiceList, invoiceCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Receiver Invoice', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredReceiverInvoice = getFilteredReceiverInvoice;
//# sourceMappingURL=receiverInvoice.controller.js.map