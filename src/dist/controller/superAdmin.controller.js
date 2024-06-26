"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredSuperAdmin = exports.createSuperAdmin = void 0;
const superAdmin_model_1 = require("../model/superAdmin.model");
const express_validator_1 = require("express-validator");
const TokenManager = require("../utils/tokenManager");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var activity = "SuperAdmin";
let createSuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const admin = await superAdmin_model_1.SuperAdmin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!admin) {
                req.body.password = await (0, Encryption_1.encrypt)(req.body.password);
                req.body.confirmPassword = await (0, Encryption_1.encrypt)(req.body.confirmPassword);
                const superAdminDetails = req.body;
                const createData = new superAdmin_model_1.SuperAdmin(superAdminDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'SuperAdmin'
                });
                const result = {};
                result['_id'] = insertData._id;
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'SuperAdmin';
                finalResult["superAdminDetails"] = result;
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Super-Admin', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Super-Admin', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Super-Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Super-Admin', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createSuperAdmin = createSuperAdmin;
let getFilteredSuperAdmin = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId });
        }
        if (req.body.agentId) {
            andList.push({ agentId: req.body.agentId });
        }
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId });
        }
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId });
        }
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const superAdminList = await superAdmin_model_1.SuperAdmin.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const superAdminCount = await superAdmin_model_1.SuperAdmin.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterSuperAdmin', true, 200, { superAdminList, superAdminCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterSuperAdmin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredSuperAdmin = getFilteredSuperAdmin;
//# sourceMappingURL=superAdmin.controller.js.map