"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCommission = exports.deleteCourseType = exports.deleteCommission = exports.updateCommission = exports.createCommission = exports.getSingleCommission = exports.getAllCommission = void 0;
const commission_model_1 = require("../model/commission.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Commission";
const getAllCommission = async (req, res) => {
    try {
        const data = await commission_model_1.Commission.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Commission', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Commission', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCommission = getAllCommission;
const getSingleCommission = async (req, res) => {
    try {
        const data = await commission_model_1.Commission.findOne({ _id: req.query._id });
        console.log("66", data.years[0].courseTypes[0].value);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Commission', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Commission', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCommission = getSingleCommission;
let createCommission = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const commission = await commission_model_1.Commission.findOne({ universityName: req.body.universityName });
            if (!commission) {
                const commissionDetails = req.body;
                commissionDetails.createdOn = new Date();
                const createData = new commission_model_1.Commission(commissionDetails);
                let insertData = await createData.save();
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Commission', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Commission', true, 422, {}, 'University Name already registered for Commission');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Commission', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Commission', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createCommission = createCommission;
let updateCommission = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const commissionDetails = req.body;
            const updateData = await commission_model_1.Commission.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    country: commissionDetails.country,
                    universityName: commissionDetails.universityName,
                    paymentMethod: commissionDetails.paymentMethod,
                    amount: commissionDetails.amount,
                    percentage: commissionDetails.percentage,
                    commissionPaidOn: commissionDetails.commissionPaidOn,
                    eligibility: commissionDetails.eligibility,
                    tax: commissionDetails.tax,
                    paymentType: commissionDetails.paymentType,
                    currency: commissionDetails.currency,
                    flag: commissionDetails.flag,
                    clientName: commissionDetails.clientName,
                    modifiedOn: new Date(),
                    modifiedBy: commissionDetails.modifiedBy,
                },
                $addToSet: {
                    years: commissionDetails.years,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Commission', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Commission', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Commission', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateCommission = updateCommission;
let deleteCommission = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await commission_model_1.Commission.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Commission', true, 200, country, 'Successfully Remove the Commission Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Commission', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCommission = deleteCommission;
let deleteCourseType = async (req, res, next) => {
    try {
        let commissionId = req.query.commissionId; // The main document's _id
        let yearId = req.query.yearId; // The _id of the year containing the courseType
        let courseTypeId = req.query.courseTypeId; // The _id of the courseType to be deleted
        console.log("55", commissionId, yearId, courseTypeId);
        // console.log("66", data.years[0].courseTypes[0].value)
        const updateResult = await commission_model_1.Commission.updateOne({ _id: commissionId, 'years._id': yearId }, { $pull: { 'years.$.courseTypes': { _id: courseTypeId } } });
        console.log("33", updateResult);
        if (updateResult.modifiedCount === 0) {
            return (0, commonResponseHandler_1.response)(req, res, 'activity', 'Level-3', 'Delete Course Type', false, 404, {}, 'Course Type not found');
        }
        const updatedDocument = await commission_model_1.Commission.findById(commissionId);
        console.log("99", updatedDocument);
        (0, commonResponseHandler_1.response)(req, res, 'activity', 'Level-2', 'Deleted the Course Type', true, 200, updatedDocument, 'Successfully removed the course type');
    }
    catch (err) {
        console.log("77", err);
        (0, commonResponseHandler_1.response)(req, res, 'activity', 'Level-3', 'Delete Course Type', false, 500, {}, 'Internal Server Error', err.message);
    }
};
exports.deleteCourseType = deleteCourseType;
let getFilteredCommission = async (req, res, next) => {
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
        if (req.body.commissionPaidOn) {
            andList.push({ commissionPaidOn: req.body.commissionPaidOn });
        }
        if (req.body.paymentMethod) {
            andList.push({ paymentMethod: req.body.paymentMethod });
        }
        if (req.body.tax) {
            andList.push({ tax: req.body.tax });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await commission_model_1.Commission.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await commission_model_1.Commission.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Commission', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Commission', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCommission = getFilteredCommission;
//# sourceMappingURL=commission.controller.js.map