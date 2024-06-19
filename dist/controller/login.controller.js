"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginEmail = void 0;
const express_validator_1 = require("express-validator");
const Encryption_1 = require("../helper/Encryption");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const TokenManager = require("../utils/tokenManager");
const superAdmin_model_1 = require("../model/superAdmin.model");
const admin_model_1 = require("../model/admin.model");
const student_model_1 = require("../model/student.model");
const agent_model_1 = require("../model/agent.model");
var activity = "Login";
/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to Login.
 */
let loginEmail = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            let { email, password } = req.body;
            const student = await student_model_1.Student.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 });
            const superAdmin = await superAdmin_model_1.SuperAdmin.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 });
            const admin = await admin_model_1.Admin.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 });
            const agent = await agent_model_1.Agent.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 });
            if (student) {
                const newHash = await (0, Encryption_1.decrypt)(student["password"]);
                if (student["status"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if (newHash != password) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: student["_id"],
                        name: student["name"],
                        loginType: 'student'
                    });
                    const details = {};
                    details['_id'] = student._id;
                    details['email'] = student.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'student';
                    finalResult["studentDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else if (agent) {
                const newHash = await (0, Encryption_1.decrypt)(agent["password"]);
                if (agent["status"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if (newHash != password) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: agent["_id"],
                        name: agent["name"],
                        loginType: 'agent'
                    });
                    const details = {};
                    details['_id'] = agent._id;
                    details['email'] = agent.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'agent';
                    finalResult["agentDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else if (superAdmin) {
                const newHash = await (0, Encryption_1.decrypt)(superAdmin["password"]);
                if (superAdmin["status"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if (newHash != password) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: superAdmin["_id"],
                        name: superAdmin["name"],
                        loginType: 'superAdmin'
                    });
                    const details = {};
                    details['_id'] = superAdmin._id;
                    details['email'] = superAdmin.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'superAdmin';
                    finalResult["superAdminDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else if (admin) {
                const newHash = await (0, Encryption_1.decrypt)(admin["password"]);
                if (admin["status"] === 2) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, ErrorMessage_1.clientError.account.inActive);
                }
                else if (newHash != password) {
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                }
                else {
                    const token = await TokenManager.CreateJWTToken({
                        id: admin["_id"],
                        name: admin["name"],
                        loginType: 'admin'
                    });
                    const details = {};
                    details['_id'] = admin._id;
                    details['email'] = admin.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'admin';
                    finalResult["adminDetails"] = details;
                    finalResult["token"] = token;
                    (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, ErrorMessage_1.clientError.success.loginSuccess);
                }
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', true, 422, {}, 'Invalid Email Id');
            }
        }
        catch (err) {
            console.log(err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Login-Email', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
        }
    }
};
exports.loginEmail = loginEmail;
//# sourceMappingURL=login.controller.js.map