"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomField = exports.updateCustomField = exports.createCustomFields = exports.getSingleCustomFields = exports.getAllCustomField = void 0;
const customField_model_1 = require("../../moduleSetting/model/customField.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-Add Label";
const getAllCustomField = async (req, res) => {
    try {
        const data = await customField_model_1.CustomField.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-CustomFields', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-CustomFields', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCustomField = getAllCustomField;
const getSingleCustomFields = async (req, res) => {
    try {
        const data = await customField_model_1.CustomField.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-CustomFields', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-CustomFields', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCustomFields = getSingleCustomFields;
let createCustomFields = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const Customdata = req.body;
            const createData = new customField_model_1.CustomField(Customdata);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-CustomField', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-CustomField', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-CustomField', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createCustomFields = createCustomFields;
const updateCustomField = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const customLabel = req.body;
            let statusData = await customField_model_1.CustomField.findByIdAndUpdate({ _id: customLabel._id }, {
                $set: {
                    customFieldFor: customLabel.customFieldFor,
                    fieldLabel: customLabel.fieldLabel,
                    defaultValue: customLabel.defaultValue,
                    helpText: customLabel.helpText,
                    fieldType: customLabel.fieldType,
                    thisFieldIsRequired: customLabel.thisFieldIsRequired,
                    showOnTable: customLabel.showOnTable,
                    visibleForAdminOnly: customLabel.visibleForAdminOnly,
                    visibleForClient: customLabel.visibleForClient,
                    active: customLabel.active,
                    modifiedOn: customLabel.modifiedOn,
                    modifiedBy: customLabel.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-LabelFields', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-LabelFields', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-LabelFields', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateCustomField = updateCustomField;
let deleteCustomField = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await customField_model_1.CustomField.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the UniversityList', true, 200, country, 'Successfully Remove UniversityList');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the UniversityList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCustomField = deleteCustomField;
