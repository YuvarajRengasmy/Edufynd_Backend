"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredPromotion = exports.deletePromotion = exports.updatePromotion = exports.createPromotion = exports.getSinglePromotion = exports.getAllPromotion = void 0;
const promotion_model_1 = require("./promotion.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Promotion";
const getAllPromotion = async (req, res) => {
    try {
        const data = await promotion_model_1.Promotion.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Promotion', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Promotion', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllPromotion = getAllPromotion;
const getSinglePromotion = async (req, res) => {
    try {
        const data = await promotion_model_1.Promotion.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Promotion', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Promotion', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSinglePromotion = getSinglePromotion;
let createPromotion = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const Data = req.body;
            const createData = new promotion_model_1.Promotion(Data);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Promotion', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Promotion', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Promotion', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createPromotion = createPromotion;
const updatePromotion = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const promotionData = req.body;
            let statusData = await promotion_model_1.Promotion.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    typeOfUser: promotionData.typeOfUser,
                    userName: promotionData.userName,
                    subject: promotionData.subject,
                    content: promotionData.content,
                    uploadImage: promotionData.uploadImage,
                    modifiedOn: new Date(),
                    modifiedBy: promotionData.modifiedBy,
                },
            }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Promotion', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Promotion', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Promotion', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updatePromotion = updatePromotion;
let deletePromotion = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await promotion_model_1.Promotion.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Promotion', true, 200, data, 'Successfully Remove Promotion');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Promotion', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deletePromotion = deletePromotion;
let getFilteredPromotion = async (req, res, next) => {
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
        const promotionList = await promotion_model_1.Promotion.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const promotionCount = await promotion_model_1.Promotion.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterPromotion', true, 200, { promotionList, promotionCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterPromotion', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredPromotion = getFilteredPromotion;
//# sourceMappingURL=promotion.controller.js.map