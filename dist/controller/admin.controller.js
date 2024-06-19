"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaffByAdmin = exports.createStudentByAdmin = exports.createAdmin = exports.getSingleAdmin = exports.getAllAdmin = void 0;
const admin_model_1 = require("../model/admin.model");
const student_model_1 = require("../model/student.model");
const express_validator_1 = require("express-validator");
const TokenManager = require("../utils/tokenManager");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
var activity = "Admin";
let getAllAdmin = async (req, res, next) => {
    try {
        const data = await admin_model_1.Admin.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Admin', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllAdmin = getAllAdmin;
let getSingleAdmin = async (req, res, next) => {
    try {
        const agent = await admin_model_1.Admin.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Admin', true, 200, agent, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleAdmin = getSingleAdmin;
let createAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const admin = await admin_model_1.Admin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!admin) {
                req.body.password = await (0, Encryption_1.encrypt)(req.body.password);
                req.body.confirmPassword = await (0, Encryption_1.encrypt)(req.body.confirmPassword);
                const adminDetails = req.body;
                const uniqueId = Math.floor(Math.random() * 1000);
                adminDetails.adminCode = "AD" + uniqueId + "Fynd";
                const createData = new admin_model_1.Admin(adminDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'admin'
                });
                const result = {};
                result['_id'] = insertData._id;
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'admin';
                finalResult["adminDetails"] = result;
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Admin', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createAdmin = createAdmin;
let createStudentByAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails = req.body;
            const studentDetails = req.body;
            // Find the Admin in the database
            const admin = await admin_model_1.Admin.findOne({ _id: req.query._id });
            if (!admin) {
                return res.status(400).json({ success: false, message: 'Admin ID is required' });
            }
            // Admin exist, proceed to create a new student
            const createStudent = new student_model_1.Student({ ...studentDetails, adminId: admin._id });
            // Save the student to the database
            const insertStudent = await createStudent.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-Admin', true, 200, {
                student: insertStudent,
                adminId: admin._id
            }, 'Student created successfully by Admin.');
        }
        catch (err) {
            // Handle server error
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-Admin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        // Request body validation failed, respond with error message
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-Admin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createStudentByAdmin = createStudentByAdmin;
let createStaffByAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails = req.body;
            const staffDetails = req.body;
            // Find the Admin in the database
            const admin = await admin_model_1.Admin.findOne({ _id: req.query._id });
            if (!admin) {
                return res.status(400).json({ success: false, message: 'Admin ID is required' });
            }
            // Admin exist, proceed to create a new staff
            const createstaff = new admin_model_1.Admin({ ...staffDetails, AdminId: admin._id });
            // Save the staff to the database
            const insertStaff = await createstaff.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', true, 200, {
                staff: insertStaff,
                AdminId: admin._id
            }, 'Staff created successfully by Admin.');
        }
        catch (err) {
            // Handle server error
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        // Request body validation failed, respond with error message
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createStaffByAdmin = createStaffByAdmin;
//# sourceMappingURL=admin.controller.js.map