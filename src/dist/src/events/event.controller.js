"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredEvent = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getSingleEvent = exports.getAllEvent = void 0;
const event_model_1 = require("./event.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Event";
const getAllEvent = async (req, res) => {
    try {
        const data = await event_model_1.Event.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Event', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Event', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllEvent = getAllEvent;
const getSingleEvent = async (req, res) => {
    try {
        const data = await event_model_1.Event.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Event', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Event', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleEvent = getSingleEvent;
let createEvent = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const Data = req.body;
            const createData = new event_model_1.Event(Data);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Event', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Event', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Event', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const eventData = req.body;
            let statusData = await event_model_1.Event.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    typeOfUser: eventData.typeOfUser,
                    userName: eventData.userName,
                    eventTopic: eventData.eventTopic,
                    date: eventData.date,
                    time: eventData.time,
                    venue: eventData.venue,
                    modifiedOn: new Date(),
                    modifiedBy: eventData.modifiedBy,
                },
            }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Event', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Event', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Event', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateEvent = updateEvent;
let deleteEvent = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await event_model_1.Event.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Event', true, 200, data, 'Successfully Remove Event');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Event', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteEvent = deleteEvent;
let getFilteredEvent = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.typeOfUser) {
            andList.push({ typeOfUser: req.body.typeOfUser });
        }
        if (req.body.venue) {
            andList.push({ venue: req.body.venue });
        }
        if (req.body.userName) {
            andList.push({ userName: req.body.userName });
        }
        if (req.body.eventTopic) {
            andList.push({ eventTopic: req.body.eventTopic });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const eventList = await event_model_1.Event.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const eventCount = await event_model_1.Event.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterEvent', true, 200, { eventList, eventCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterEvent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredEvent = getFilteredEvent;
//# sourceMappingURL=event.controller.js.map