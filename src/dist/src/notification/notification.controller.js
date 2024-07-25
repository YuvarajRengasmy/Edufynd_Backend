"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredNotification = exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getSingleNotification = exports.getAllNotification = void 0;
const notification_model_1 = require("./notification.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Notification";
const getAllNotification = async (req, res) => {
    try {
        const data = await notification_model_1.Notification.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Notification', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Notification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllNotification = getAllNotification;
const getSingleNotification = async (req, res) => {
    try {
        const data = await notification_model_1.Notification.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Notification', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Notification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleNotification = getSingleNotification;
let createNotification = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const Data = req.body;
            const createData = new notification_model_1.Notification(Data);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Notification', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Notification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Notification', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createNotification = createNotification;
const updateNotification = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const notificationData = req.body;
            let statusData = await notification_model_1.Notification.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    typeOfUser: notificationData.typeOfUser,
                    userName: notificationData.userName,
                    subject: notificationData.subject,
                    content: notificationData.content,
                    uploadImage: notificationData.uploadImage,
                    modifiedOn: new Date(),
                    modifiedBy: notificationData.modifiedBy,
                },
            }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Notification', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Notification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Notification', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateNotification = updateNotification;
let deleteNotification = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await notification_model_1.Notification.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Notification', true, 200, data, 'Successfully Remove Notification');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Notification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteNotification = deleteNotification;
let getFilteredNotification = async (req, res, next) => {
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
        if (req.body.subject) {
            andList.push({ subject: req.body.subject });
        }
        if (req.body.userName) {
            andList.push({ userName: req.body.userName });
        }
        if (req.body.content) {
            andList.push({ content: req.body.content });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const notificationList = await notification_model_1.Notification.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const notificationCount = await notification_model_1.Notification.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterNotification', true, 200, { notificationList, notificationCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterNotification', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredNotification = getFilteredNotification;
//# sourceMappingURL=notification.controller.js.map