"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredLoanEnquiry = exports.deleteLoanEnquiry = exports.updateLoanEnquiry = exports.createLoanEnquiry = exports.getSingleLoanEnquiry = exports.getAllLoanEnquiry = void 0;
const loanEnquiry_model_1 = require("../model/loanEnquiry.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
var activity = "LoanEnquiry";
let getAllLoanEnquiry = async (req, res, next) => {
    try {
        const data = await loanEnquiry_model_1.LoanEnquiry.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-LoanEnquiry', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-LoanEnquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllLoanEnquiry = getAllLoanEnquiry;
let getSingleLoanEnquiry = async (req, res, next) => {
    try {
        const student = await loanEnquiry_model_1.LoanEnquiry.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-LoanEnquiry', true, 200, student, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-LoanEnquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleLoanEnquiry = getSingleLoanEnquiry;
const generateNextLoanID = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const loan = await loanEnquiry_model_1.LoanEnquiry.find({}, 'loanID').exec();
    const maxCounter = loan.reduce((max, app) => {
        const appCode = app.loanID;
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
    return `EL_${formattedCounter}`;
};
let createLoanEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const enquiryDetails = req.body;
            enquiryDetails.createdOn = new Date();
            enquiryDetails.loanID = await generateNextLoanID();
            const createData = new loanEnquiry_model_1.LoanEnquiry(enquiryDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'LoanEnquiry-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'LoanEnquiry-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'LoanEnquiry-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createLoanEnquiry = createLoanEnquiry;
let updateLoanEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const loanEnquiryDetails = req.body;
            const updateData = await loanEnquiry_model_1.LoanEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    studentName: loanEnquiryDetails.studentName,
                    whatsAppNumber: loanEnquiryDetails.whatsAppNumber,
                    email: loanEnquiryDetails.email,
                    doYouHaveAValidOfferFromAnyUniversity: loanEnquiryDetails.doYouHaveAValidOfferFromAnyUniversity,
                    uploadOfferletter: loanEnquiryDetails.uploadOfferletter,
                    loanAmountRequired: loanEnquiryDetails.loanAmountRequired,
                    desiredCountry: loanEnquiryDetails.desiredCountry,
                    whatIsYourMonthlyIncome: loanEnquiryDetails.whatIsYourMonthlyIncome,
                    passportNumber: loanEnquiryDetails.passportNumber,
                    uploadPassport: loanEnquiryDetails.uploadPassport,
                    didYouApplyForLoanElsewhere: loanEnquiryDetails.didYouApplyForLoanElsewhere,
                    chooseTheBankYouPreviouslyApplied: loanEnquiryDetails.chooseTheBankYouPreviouslyApplied,
                    statusOfPreviousApplication: loanEnquiryDetails.statusOfPreviousApplication,
                    coApplicantName: loanEnquiryDetails.coApplicantName,
                    age: loanEnquiryDetails.age,
                    employmentStatus: loanEnquiryDetails.employmentStatus,
                    incomeDetails: loanEnquiryDetails.incomeDetails,
                    willyouSubmitYourCollateral: loanEnquiryDetails.willyouSubmitYourCollateral,
                    message: loanEnquiryDetails.message,
                    studentId: loanEnquiryDetails.studentId,
                    country: loanEnquiryDetails.country,
                    universityName: loanEnquiryDetails.universityName,
                    modifiedOn: new Date(),
                    modifiedBy: loanEnquiryDetails.modifiedBy,
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
exports.updateLoanEnquiry = updateLoanEnquiry;
let deleteLoanEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const loan = await loanEnquiry_model_1.LoanEnquiry.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Loan Enquiry Details', true, 200, loan, 'Successfully Remove Loan Enquiry Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Loan Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteLoanEnquiry = deleteLoanEnquiry;
let getFilteredLoanEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.desiredCountry) {
            andList.push({ desiredCountry: req.body.desiredCountry });
        }
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName });
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo });
        }
        if (req.body.email) {
            andList.push({ email: req.body.email });
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const loanList = await loanEnquiry_model_1.LoanEnquiry.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const loanCount = await loanEnquiry_model_1.LoanEnquiry.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterLoanEnquiry', true, 200, { loanList, loanCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterLoanEnquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredLoanEnquiry = getFilteredLoanEnquiry;
//# sourceMappingURL=loanEnquiry.controller.js.map