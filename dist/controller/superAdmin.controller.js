"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaffBySuperAdmin = exports.createAdminBySuperAdmin = exports.createAgentBySuperAdmin = exports.createStudentBySuperAdmin = exports.createSuperAdmin = void 0;
const superAdmin_model_1 = require("../model/superAdmin.model");
const student_model_1 = require("../model/student.model");
const agent_model_1 = require("../model/agent.model");
const admin_model_1 = require("../model/admin.model");
const express_validator_1 = require("express-validator");
const TokenManager = __importStar(require("../utils/tokenManager"));
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
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
let createStudentBySuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const superAdminDetails = req.body;
            const studentDetails = req.body;
            // Find the superAdmin in the database
            const superAdmin = await superAdmin_model_1.SuperAdmin.findOne({ _id: req.query._id });
            if (!superAdmin) {
                return res.status(400).json({ success: false, message: 'Super Admin ID is required' });
            }
            // SuperAdmin exist, proceed to create a new student
            const createStudent = new student_model_1.Student({ ...studentDetails, superAdminId: superAdmin._id });
            // Save the student to the database
            const insertStudent = await createStudent.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', true, 200, {
                student: insertStudent,
                superAdminId: superAdmin._id
            }, 'Student created successfully by SuperAdmin.');
        }
        catch (err) {
            // Handle server error
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        // Request body validation failed, respond with error message
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createStudentBySuperAdmin = createStudentBySuperAdmin;
let createAgentBySuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const superAdminDetails = req.body;
            const agentDetails = req.body;
            // Find the superAdmin in the database
            const superAdmin = await superAdmin_model_1.SuperAdmin.findOne({ _id: req.query._id });
            if (!superAdmin) {
                return res.status(400).json({ success: false, message: 'Super Admin ID is required' });
            }
            // SuperAdmin exist, proceed to create a new agent
            const createAgent = new agent_model_1.Agent({ ...agentDetails, superAdminId: superAdmin._id });
            // Save the agent to the database
            const insertAgent = await createAgent.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', true, 200, {
                agent: insertAgent,
                superAdminId: superAdmin._id
            }, 'Agent created successfully by SuperAdmin.');
        }
        catch (err) {
            // Handle server error
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        // Request body validation failed, respond with error message
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createAgentBySuperAdmin = createAgentBySuperAdmin;
let createAdminBySuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const superAdminDetails = req.body;
            const adminDetails = req.body;
            // Find the superAdmin in the database
            const superAdmin = await superAdmin_model_1.SuperAdmin.findOne({ _id: req.query._id });
            if (!superAdmin) {
                return res.status(400).json({ success: false, message: 'Super Admin ID is required' });
            }
            // SuperAdmin exist, proceed to create a new agent
            const createAdmin = new admin_model_1.Admin({ ...adminDetails, superAdminId: superAdmin._id });
            // Save the agent to the database
            const insertAdmin = await createAdmin.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', true, 200, {
                admin: insertAdmin,
                superAdminId: superAdmin._id
            }, 'Admin created successfully by SuperAdmin.');
        }
        catch (err) {
            // Handle server error
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        // Request body validation failed, respond with error message
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createAdminBySuperAdmin = createAdminBySuperAdmin;
let createStaffBySuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const superAdminDetails = req.body;
            const staffDetails = req.body;
            // Find the superAdmin in the database
            const superAdmin = await superAdmin_model_1.SuperAdmin.findOne({ _id: req.query._id });
            if (!superAdmin) {
                return res.status(400).json({ success: false, message: 'Super Admin ID is required' });
            }
            // SuperAdmin exist, proceed to create a new staff
            const createstaff = new admin_model_1.Admin({ ...staffDetails, superAdminId: superAdmin._id });
            // Save the agent to the database
            const insertStaff = await createstaff.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', true, 200, {
                staff: insertStaff,
                superAdminId: superAdmin._id
            }, 'Staff created successfully by SuperAdmin.');
        }
        catch (err) {
            // Handle server error
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        // Request body validation failed, respond with error message
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createStaffBySuperAdmin = createStaffBySuperAdmin;
