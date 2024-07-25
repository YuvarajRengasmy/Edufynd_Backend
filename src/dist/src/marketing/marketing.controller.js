"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredMarketing = exports.deleteMarketing = exports.updateMarketing = exports.createMarketing = exports.getSingleMarketing = exports.getAllMarketing = void 0;
const marketing_model_1 = require("./marketing.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Marketing";
const getAllMarketing = async (req, res) => {
    try {
        const data = await marketing_model_1.Marketing.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Marketing', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Marketing', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllMarketing = getAllMarketing;
const getSingleMarketing = async (req, res) => {
    try {
        const data = await marketing_model_1.Marketing.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Marketing', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Marketing', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleMarketing = getSingleMarketing;
let createMarketing = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const Data = req.body;
            const createData = new marketing_model_1.Marketing(Data);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Marketing', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Marketing', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Marketing', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createMarketing = createMarketing;
const updateMarketing = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const marketingData = req.body;
            let statusData = await marketing_model_1.Marketing.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    socialMedia: marketingData.socialMedia,
                    noOfFollowers: marketingData.noOfFollowers,
                    noOfCampaigns: marketingData.noOfCampaigns,
                    noOfLeads: marketingData.noOfLeads,
                    platformName: marketingData.platformName,
                    campaignName: marketingData.campaignName,
                    budgetRequested: marketingData.budgetRequested,
                    budgetAlloted: marketingData.budgetAlloted,
                    budgetSpent: marketingData.budgetSpent,
                    leadsGenerated: marketingData.leadsGenerated,
                    leadsConverted: marketingData.leadsConverted,
                    modifiedOn: new Date(),
                    modifiedBy: marketingData.modifiedBy,
                },
            }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Marketing', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Marketing', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Marketing', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateMarketing = updateMarketing;
let deleteMarketing = async (req, res, next) => {
    try {
        let id = req.query._id;
        const data = await marketing_model_1.Marketing.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the Marketing', true, 200, data, 'Successfully Remove Marketing');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the Marketing', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteMarketing = deleteMarketing;
let getFilteredMarketing = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.socialMedia) {
            andList.push({ socialMedia: req.body.socialMedia });
        }
        if (req.body.platformName) {
            andList.push({ platformName: req.body.platformName });
        }
        if (req.body.campaignName) {
            andList.push({ campaignName: req.body.campaignName });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const marketingList = await marketing_model_1.Marketing.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const marketingCount = await marketing_model_1.Marketing.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter Marketing', true, 200, { marketingList, marketingCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter Marketing', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredMarketing = getFilteredMarketing;
//# sourceMappingURL=marketing.controller.js.map