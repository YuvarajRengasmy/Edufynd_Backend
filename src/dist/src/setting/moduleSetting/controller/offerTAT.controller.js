"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredOfferTAT = exports.deleteOfferTAT = exports.updateOfferTAT = exports.createOfferTAT = exports.getSingleOfferTAT = exports.getAllOfferTAT = void 0;
const offerTAT_model_1 = require("../model/offerTAT.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-All Module-Program-CourseType";
const getAllOfferTAT = async (req, res) => {
    try {
        const data = await offerTAT_model_1.OfferTAT.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-OfferTAT', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-OfferTAT', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllOfferTAT = getAllOfferTAT;
const getSingleOfferTAT = async (req, res) => {
    try {
        const data = await offerTAT_model_1.OfferTAT.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-OfferTAT', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-OfferTAT', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleOfferTAT = getSingleOfferTAT;
let createOfferTAT = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new offerTAT_model_1.OfferTAT(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-OfferTAT', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-OfferTAT', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-OfferTAT', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createOfferTAT = createOfferTAT;
const updateOfferTAT = async (req, res) => {
    const DropdownListDetails = req.body;
    try {
        // Check if the module exists
        const existingModule = await offerTAT_model_1.OfferTAT.findById({ _id: DropdownListDetails._id });
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Update the module with the new data
        existingModule.offerTAT = DropdownListDetails.offerTAT; // Assuming courseType is the only field being updated
        // Save the updated module
        let updatedModule = await existingModule.save();
        // Respond with success message and updated module data
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-CourseTypeList', true, 200, updatedModule, ErrorMessage_1.clientError.success.updateSuccess);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-CourseTypeList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.updateOfferTAT = updateOfferTAT;
let deleteOfferTAT = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await offerTAT_model_1.OfferTAT.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the OfferTAT', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the OfferTAT', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteOfferTAT = deleteOfferTAT;
let getFilteredOfferTAT = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.offerTAT) {
            andList.push({ offerTAT: req.body.offerTAT });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await offerTAT_model_1.OfferTAT.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await offerTAT_model_1.OfferTAT.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter OfferTAT', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter OfferTAT', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredOfferTAT = getFilteredOfferTAT;
//# sourceMappingURL=offerTAT.controller.js.map