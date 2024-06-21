"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToJson = exports.getFilteredStaff = exports.createStaffBySuperAdmin = exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getSingleStaff = exports.getAllStaff = void 0;
const staff_model_1 = require("../model/staff.model");
const superAdmin_model_1 = require("../model/superAdmin.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const csv = require("csvtojson");
var activity = "Staff";
const getAllStaff = async (req, res) => {
    try {
        const data = await staff_model_1.Staff.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Staff', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Staff', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllStaff = getAllStaff;
const getSingleStaff = async (req, res) => {
    try {
        const data = await staff_model_1.Staff.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Staff', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Staff', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleStaff = getSingleStaff;
let createStaff = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const staffDetails = req.body;
            const createData = new staff_model_1.Staff(staffDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Staff', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createStaff = createStaff;
const updateStaff = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const staffDetails = req.body;
            let staffData = await staff_model_1.Staff.findByIdAndUpdate({ _id: staffDetails._id }, {
                $set: {
                    photo: staffDetails.photo,
                    empName: staffDetails.empName,
                    designation: staffDetails.designation,
                    jobDescription: staffDetails.jobDescription,
                    reportingManager: staffDetails.reportingManager,
                    shiftTiming: staffDetails.shiftTiming,
                    areTheyEligibleForCasualLeave: staffDetails.areTheyEligibleForCasualLeave,
                    address: staffDetails.address,
                    emergencyContactNo: staffDetails.emergencyContactNo,
                    probationDuration: staffDetails.probationDuration,
                    salary: staffDetails.salary,
                    privileges: staffDetails.privileges,
                    idCard: staffDetails.idCard,
                    manageApplications: staffDetails.manageApplications,
                    activeInactive: staffDetails.activeInactive,
                    teamLead: staffDetails.teamLead,
                    status: staffDetails.status,
                    modifiedOn: staffDetails.modifiedOn,
                    modifiedBy: staffDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Staff Details', true, 200, staffData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Staff Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Staff Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateStaff = updateStaff;
let deleteStaff = async (req, res, next) => {
    try {
        let id = req.query._id;
        const staff = await staff_model_1.Staff.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-StaffDetail', true, 200, staff, 'Successfully Remove Staff');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-StaffDetail', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteStaff = deleteStaff;
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
            const createstaff = new staff_model_1.Staff({ ...staffDetails, superAdminId: superAdmin._id });
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
/**
 * @author Balan K K
 * @date 28-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter Staff Details
 */
let getFilteredStaff = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.empName) {
            andList.push({ empName: req.body.empName });
        }
        if (req.body.designation) {
            andList.push({ designation: req.body.designation });
        }
        if (req.body.reportingManager) {
            andList.push({ reportingManager: req.body.reportingManager });
        }
        if (req.body.manageApplications) {
            andList.push({ manageApplications: req.body.manageApplications });
        }
        if (req.body.teamLead) {
            andList.push({ teamLead: req.body.teamLead });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const staffList = await staff_model_1.Staff.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const staffCount = await staff_model_1.Staff.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterStaff', true, 200, { staffList, staffCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterStaff', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredStaff = getFilteredStaff;
const csvToJson = async (req, res) => {
    try {
        let staffList = [];
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);
        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            staffList.push({
                empName: csvData[i].EmpName,
                designation: csvData[i].Designation,
                jobDescription: csvData[i].JobDescription,
                reportingManager: csvData[i].ReportingManager,
                shiftTiming: csvData[i].ShiftTiming,
                areTheyEligibleForCasualLeave: csvData[i].AreTheyEligibleForCasualLeave,
                doj: csvData[i].DOJ,
                dob: csvData[i].DOB,
                addressline1: csvData[i].AddressLine1,
                addressline2: csvData[i].AddressLine2,
                addressline3: csvData[i].AddressLine3,
                email: csvData[i].Email,
                mobileNumber: csvData[i].MobileNo,
                emergencyContactNo: csvData[i].EmergencyContactNo,
                probationDuration: csvData[i].ProbationDuration,
                salary: csvData[i].salary,
                idCard: csvData[i].IDCard,
                manageApplications: csvData[i].ManageApplications,
                activeInactive: csvData[i].ActiveInactive,
                teamLead: csvData[i].TeamLead,
            });
        }
        // Insert into the database
        await staff_model_1.Staff.insertMany(staffList);
        // Send success response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for staff module', true, 200, { staffList }, 'Successfully CSV File Store Into Database');
    }
    catch (err) {
        console.error(err);
        // Send error response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for staff module', false, 500, {}, 'Internal Server Error', err.message);
    }
};
exports.csvToJson = csvToJson;
//# sourceMappingURL=staff.controller.js.map