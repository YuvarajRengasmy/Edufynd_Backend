"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredFlightTicketEnquiry = exports.deleteFlightTicketEnquiry = exports.updateFlightTicketEnquiry = exports.createFlightTicketEnquiry = exports.getSingleFlightTicketEnquiry = exports.getAllFlightTicketEnquiry = void 0;
const flightTicket_model_1 = require("../model/flightTicket.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../helper/ErrorMessage");
var activity = "FlightTicketEnquiry";
let getAllFlightTicketEnquiry = async (req, res, next) => {
    try {
        const data = await flightTicket_model_1.Flight.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Flight Ticket Enquiry', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Flight Ticket Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllFlightTicketEnquiry = getAllFlightTicketEnquiry;
let getSingleFlightTicketEnquiry = async (req, res, next) => {
    try {
        const flight = await flightTicket_model_1.Flight.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Flight Ticket Enquiry', true, 200, flight, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Flight Ticket Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleFlightTicketEnquiry = getSingleFlightTicketEnquiry;
const generateNextFlightId = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const forex = await flightTicket_model_1.Flight.find({}, 'flightID').exec();
    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.flightID;
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
    return `ET_${formattedCounter}`;
};
let createFlightTicketEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const flightDetails = req.body;
            flightDetails.createdOn = new Date();
            flightDetails.flightID = await generateNextFlightId();
            const createData = new flightTicket_model_1.Flight(flightDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Flight Ticket Enquiry-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Flight Ticket Enquiry-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Flight Ticket Enquiry-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createFlightTicketEnquiry = createFlightTicketEnquiry;
let updateFlightTicketEnquiry = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const flightEnquiryDetails = req.body;
            const updateData = await flightTicket_model_1.Flight.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    source: flightEnquiryDetails.source,
                    studentName: flightEnquiryDetails.studentName,
                    passportNo: flightEnquiryDetails.passportNo,
                    dob: flightEnquiryDetails.dob,
                    whatsAppNumber: flightEnquiryDetails.whatsAppNumber,
                    agentName: flightEnquiryDetails.agentName,
                    businessName: flightEnquiryDetails.businessName,
                    agentWhatsAppNumber: flightEnquiryDetails.agentWhatsAppNumber,
                    from: flightEnquiryDetails.from,
                    to: flightEnquiryDetails.to,
                    dateOfTravel: flightEnquiryDetails.dateOfTravel,
                    message: flightEnquiryDetails.message,
                    studentId: flightEnquiryDetails.studentId,
                    country: flightEnquiryDetails.country,
                    universityName: flightEnquiryDetails.universityName,
                    modifiedOn: new Date(),
                    modifiedBy: flightEnquiryDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Flight Ticket Enquiry Details', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Flight Ticket Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Flight Ticket Enquiry Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateFlightTicketEnquiry = updateFlightTicketEnquiry;
let deleteFlightTicketEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const loan = await flightTicket_model_1.Flight.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Flight Ticket Enquiry Details', true, 200, loan, 'Successfully Remove Flight Ticket Enquiry Details');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Flight Ticket Enquiry Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteFlightTicketEnquiry = deleteFlightTicketEnquiry;
let getFilteredFlightTicketEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName });
        }
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName });
        }
        if (req.body.from) {
            andList.push({ from: req.body.from });
        }
        if (req.body.to) {
            andList.push({ to: req.body.to });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const flightList = await flightTicket_model_1.Flight.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const flightCount = await flightTicket_model_1.Flight.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Flight Ticket Enquiry', true, 200, { flightList, flightCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Flight Ticket  Enquiry', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredFlightTicketEnquiry = getFilteredFlightTicketEnquiry;
//# sourceMappingURL=flightTicket.controller.js.map