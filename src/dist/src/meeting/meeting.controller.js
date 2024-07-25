"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredMeeting = exports.deleteMeeting = exports.updateMeeting = exports.createMeeting = exports.getSingleMeeting = exports.getAllMeeting = void 0;
const meeting_model_1 = require("./meeting.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Meeting";
const getAllMeeting = async (req, res) => {
    try {
        const data = await meeting_model_1.Meeting.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Meeting', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Meeting', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllMeeting = getAllMeeting;
const getSingleMeeting = async (req, res) => {
    try {
        const data = await meeting_model_1.Meeting.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Meeting', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Meeting', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleMeeting = getSingleMeeting;
let createMeeting = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const Data = req.body;
            const createData = new meeting_model_1.Meeting(Data);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Meeting', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Meeting', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Meeting', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createMeeting = createMeeting;
const updateMeeting = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const meetingData = req.body;
            let statusData = await meeting_model_1.Meeting.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    hostName: meetingData.hostName,
                    attendees: meetingData.attendees,
                    subject: meetingData.subject,
                    content: meetingData.content,
                    date: meetingData.date,
                    time: meetingData.time,
                    modifiedOn: new Date(),
                    modifiedBy: meetingData.modifiedBy,
                },
            }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Meeting', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Meeting', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Meeting', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateMeeting = updateMeeting;
let deleteMeeting = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await meeting_model_1.Meeting.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Meeting', true, 200, data, 'Successfully Remove Meeting');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Meeting', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteMeeting = deleteMeeting;
let getFilteredMeeting = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.hostName) {
            andList.push({ hostName: req.body.hostName });
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject });
        }
        if (req.body.attendees) {
            andList.push({ attendees: req.body.attendees });
        }
        if (req.body.content) {
            andList.push({ content: req.body.content });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const meetingList = await meeting_model_1.Meeting.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const meetingCount = await meeting_model_1.Meeting.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Meeting', true, 200, { meetingList, meetingCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Meeting', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredMeeting = getFilteredMeeting;
//# sourceMappingURL=meeting.controller.js.map