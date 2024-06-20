"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const contact_model_1 = require("../model/contact.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Contact";
let createContact = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const contactDetails = req.body;
            const createData = new contact_model_1.Contact(contactDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Contact-Created', true, 200, insertData, ErrorMessage_1.clientError.success.registerSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Contact-Created', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Contact-Created', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createContact = createContact;
