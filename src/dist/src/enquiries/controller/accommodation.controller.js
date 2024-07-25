"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredAccommodation = exports.deleteAccommodationEnquiry = exports.updateAccommodation = exports.createAccommodation = exports.getSingleAccommodation = exports.getAllAccommodation = void 0;
const accommodation_model_1 = require("../model/accommodation.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
var activity = "AccommodationEnquiry";
let getAllAccommodation = async (req, res, next) => {
    try {
        const data = await accommodation_model_1.Accommodation.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-AccommodationEnquiry', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-AccommodationEnquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllAccommodation = getAllAccommodation;
let getSingleAccommodation = async (req, res, next) => {
    try {
        const accommodation = await accommodation_model_1.Accommodation.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-AccommodationEnquiry', true, 200, accommodation, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-AccommodationEnquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleAccommodation = getSingleAccommodation;
const generateNextAccommodationID = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const enquiry = await accommodation_model_1.Accommodation.find({}, 'accommodationID').exec();
    const maxCounter = enquiry.reduce((max, app) => {
        const appCode = app.accommodationID;
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
    return `EA_${formattedCounter}`;
};
let createAccommodation = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const accommodationDetails = req.body;
            accommodationDetails.createdOn = new Date();
            accommodationDetails.accommodationID = await generateNextAccommodationID();
            const createData = new accommodation_model_1.Accommodation(accommodationDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Accommodation Enquiry-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Accommodation Enquiry-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Accommodation Enquiry-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createAccommodation = createAccommodation;
let updateAccommodation = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const accommodationDetails = req.body;
            const updateData = await accommodation_model_1.Accommodation.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    studentName: accommodationDetails.studentName,
                    source: accommodationDetails.source,
                    passportNumber: accommodationDetails.passportNumber,
                    whatsAppNumber: accommodationDetails.whatsAppNumber,
                    universityName: accommodationDetails.universityName,
                    holdingOfferFromTheUniversity: accommodationDetails.holdingOfferFromTheUniversity,
                    locationWhereAccommodationIsRequired: accommodationDetails.locationWhereAccommodationIsRequired,
                    agentName: accommodationDetails.agentName,
                    businessName: accommodationDetails.businessName,
                    agentWhatsAppNumber: accommodationDetails.agentWhatsAppNumber,
                    assignedTo: accommodationDetails.assignedTo,
                    message: accommodationDetails.message,
                    studentId: accommodationDetails.studentId,
                    country: accommodationDetails.country,
                    state: accommodationDetails.state,
                    city: accommodationDetails.city,
                    modifiedOn: new Date(),
                    modifiedBy: accommodationDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Accommodation Enquiry Details', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Accommodation Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Accommodation Enquiry Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateAccommodation = updateAccommodation;
let deleteAccommodationEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const loan = await accommodation_model_1.Accommodation.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Accommodation Enquiry Details', true, 200, loan, 'Successfully Remove Accommodation Enquiry Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Accommodation Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteAccommodationEnquiry = deleteAccommodationEnquiry;
let getFilteredAccommodation = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.agentID) {
            andList.push({ agentID: req.body.agentID });
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
        if (req.body.UniversityName) {
            andList.push({ UniversityName: req.body.UniversityName });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const accommodationList = await accommodation_model_1.Accommodation.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const accommodationCount = await accommodation_model_1.Accommodation.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Accommodation Enquiry', true, 200, { accommodationList, accommodationCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Accommodation Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredAccommodation = getFilteredAccommodation;
//# sourceMappingURL=accommodation.controller.js.map