"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLog = exports.saveLogs = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const logs_model_1 = require("../model/logs.model");
var activity = 'LOGS';
/**
 * @author Ponjothi S
 * @date 07-09-2022
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to create Logs
 */
let saveLogs = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const LogsData = req.body;
            const createLogs = new logs_model_1.Logs(LogsData);
            let insertLogs = await createLogs.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Logs', 'Level-2', true, 200, insertLogs, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Logs', 'Level-3', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Logs', 'Level-3', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveLogs = saveLogs;
let saveLog = async (params) => {
    const LogsData = params;
    const createLogs = new logs_model_1.Logs(LogsData);
    return await createLogs.save();
};
exports.saveLog = saveLog;
