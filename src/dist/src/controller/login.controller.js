"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.loginEmail = void 0;
const express_validator_1 = require("express-validator");
const Encryption_1 = require("../helper/Encryption");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const TokenManager = require("../utils/tokenManager");
const superAdmin_model_1 = require("../model/superAdmin.model");
const admin_model_1 = require("../model/admin.model");
const student_model_1 = require("../model/student.model");
const agent_model_1 = require("../model/agent.model");
const uuid_1 = require("uuid");
const config = require("../config");
var activity = "Login";
/**
 * @author Balan K K
 * @date 01-05-2024
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
const forgotPassword = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const { email } = req.body;
            const student = await student_model_1.Student.findOne({ email });
            const admin = await admin_model_1.Admin.findOne({ email });
            const agent = await agent_model_1.Agent.findOne({ email });
            if (student) {
                const otp = (0, uuid_1.v4)().slice(0, 6); // Generate a 6-character OTP
                student.resetOtp = otp;
                student.resetOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour
                await student.save();
                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: student.email,
                    subject: 'Password Reset Request',
                    text: `Hello ${student.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 1 hour.\n\n Best regards\nAfynd Private Limited\nChennai.`
                };
                commonResponseHandler_1.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email' });
                    }
                    else {
                        console.log('Email sent:', info.response);
                        res.status(200).json({ message: 'OTP sent to email' });
                    }
                });
            }
            else if (admin) {
                const otp = (0, uuid_1.v4)().slice(0, 6); // Generate a 6-character OTP
                admin.resetOtp = otp;
                admin.resetOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour
                await admin.save();
                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: admin.email,
                    subject: 'Password Reset Request',
                    text: `Hello ${admin.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 1 hour.\n\nThank you!`
                };
                commonResponseHandler_1.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email' });
                    }
                    else {
                        console.log('Email sent:', info.response);
                        res.status(200).json({ message: 'OTP sent to email' });
                    }
                });
            }
            else if (agent) {
                const otp = (0, uuid_1.v4)().slice(0, 6); // Generate a 6-character OTP
                agent.resetOtp = otp;
                agent.resetOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour
                await agent.save();
                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: agent.email,
                    subject: 'Password Reset Request',
                    text: `Hello ${agent.agentName},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 1 hour.\n\nThank you!`
                };
                commonResponseHandler_1.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email' });
                    }
                    else {
                        console.log('Email sent:', info.response);
                        res.status(200).json({ message: 'OTP sent to email' });
                    }
                });
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'ForgotPassword', true, 422, {}, 'Invalid Email Id');
            }
        }
        catch (error) {
            console.error('Error requesting password reset:', error);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'ForgotPassword', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(error.mapped()));
        }
    }
};
exports.forgotPassword = forgotPassword;
let resetPassword = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            let student = await student_model_1.Student.findById({ _id: req.body._id });
            let admin = await admin_model_1.Admin.findById({ _id: req.body._id });
            let agent = await agent_model_1.Agent.findById({ _id: req.body._id });
            let { modifiedOn, modifiedBy } = req.body;
            let id = req.body._id;
            req.body.password = await (0, Encryption_1.encrypt)(req.body.password);
            if (student) {
                const data = await student_model_1.Student.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, ErrorMessage_1.clientError.success.updateSuccess);
            }
            else if (admin) {
                const data = await admin_model_1.Admin.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, ErrorMessage_1.clientError.success.updateSuccess);
            }
            else {
                const data = await agent_model_1.Agent.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, ErrorMessage_1.clientError.success.updateSuccess);
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Password', true, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Password', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=login.controller.js.map