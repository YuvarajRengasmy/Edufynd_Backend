"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editStaffProfileByAdmin = exports.createStaffByAdmin = exports.editStudentProfileByAdmin = exports.createStudentByAdmin = exports.editAdminProfileBySuperAdmin = exports.createAdminBySuperAdmin = exports.getFilteredAdmin = exports.deleteAdmin = exports.createAdmin = exports.getSingleAdmin = exports.getAllAdmin = void 0;
const admin_model_1 = require("../model/admin.model");
const staff_model_1 = require("../model/staff.model");
const student_model_1 = require("../model/student.model");
const express_validator_1 = require("express-validator");
const TokenManager = require("../utils/tokenManager");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
const config = require("../config");
var activity = "Admin";
let getAllAdmin = async (req, res, next) => {
    try {
        const data = await admin_model_1.Admin.find({ isDeleted: false }).sort({ adminCode: -1 });
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
const generateNextAdminCode = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const admin = await admin_model_1.Admin.find({}, 'adminCode').exec();
    const maxCounter = admin.reduce((max, app) => {
        const appCode = app.adminCode;
        const parts = appCode.split('_');
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10);
            return counter > max ? counter : max;
        }
        return max;
    }, 100);
    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `AD_${formattedCounter}`;
};
let createAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const admin = await admin_model_1.Admin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!admin) {
                req.body.password = await (0, Encryption_1.encrypt)(req.body.password);
                req.body.confirmPassword = await (0, Encryption_1.encrypt)(req.body.confirmPassword);
                const adminDetails = req.body;
                adminDetails.adminCode = await generateNextAdminCode();
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
// export let updateAdmin = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const adminDetails: AdminDocument = req.body;
//             const updateData = await Admin.findOneAndUpdate({ _id: adminDetails._id }, {
//                 $set: {
//                     businessName: agentDetails.businessName,
//                     whatsAppNumber: agentDetails.whatsAppNumber,
//                     bankDetail: agentDetails.bankDetail,
//                     panNumberIndividual: agentDetails.panNumberIndividual,
//                     panNumberCompany: agentDetails.panNumberCompany,
//                     gstn: agentDetails.gstn,
//                     inc: agentDetails.inc,
//                     agentsCommission: agentDetails.agentsCommission,
//                     agentBusinessLogo: agentDetails.agentBusinessLogo,
//                     countryInterested: agentDetails.countryInterested,
//                     privileges: agentDetails.privileges,
//                     addressLine1: agentDetails.addressLine1,
//                     addressLine2: agentDetails.addressLine2,
//                     addressLine3: agentDetails.addressLine3,
//                     staffName: agentDetails.staffName,
//                     staffContactNo: agentDetails.staffContactNo,
//                     modifiedOn: agentDetails.modifiedOn,
//                     modifiedBy: agentDetails.modifiedBy,
//                 }
//             });
//             response(req, res, activity, 'Level-2', 'Update-Agent', true, 200, updateData, clientError.success.updateSuccess);
//         }
//         catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Update-Agent', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Update-Agent', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }
let deleteAdmin = async (req, res, next) => {
    try {
        const agent = await admin_model_1.Admin.findOneAndDelete({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Admin', true, 200, agent, 'Successfully Remove the Admin');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteAdmin = deleteAdmin;
let getFilteredAdmin = async (req, res, next) => {
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
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId });
        }
        if (req.body.programId) {
            andList.push({ programId: req.body.programId });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const adminList = await admin_model_1.Admin.find(findQuery).sort({ adminCode: -1 }).limit(limit).skip(page);
        const adminCount = await admin_model_1.Admin.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterAdmin', true, 200, { adminList, adminCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterAdmin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredAdmin = getFilteredAdmin;
let createAdminBySuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails = req.body;
            adminDetails.adminCode = await generateNextAdminCode();
            const password = (0, Encryption_1.generateRandomPassword)(8);
            const confirmPassword = password; // Since password and confirmPassword should match
            adminDetails.password = await (0, Encryption_1.encrypt)(password);
            adminDetails.confirmPassword = await (0, Encryption_1.encrypt)(confirmPassword);
            const createAdmin = new admin_model_1.Admin(adminDetails);
            const insertAdmin = await createAdmin.save();
            const newHash = await (0, Encryption_1.decrypt)(insertAdmin["password"]);
            const mailOptions = {
                from: config.SERVER.EMAIL_USER,
                to: insertAdmin.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertAdmin.name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertAdmin.email}\nPassword: ${newHash}\n\nPlease change your password after logging in for the first time.\n\n Best regards\nAfynd Private Limited\nChennai.`
            };
            commonResponseHandler_1.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                }
                else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Admin profile created and email sent login credentials', admin: insertAdmin });
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', true, 200, { admin: insertAdmin }, 'Admin created successfully by SuperAdmin.');
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createAdminBySuperAdmin = createAdminBySuperAdmin;
const editAdminProfileBySuperAdmin = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails = req.body;
            const updateData = await admin_model_1.Admin.findOneAndUpdate({ _id: adminDetails._id }, {
                $set: {
                    role: adminDetails.role,
                    modifiedOn: adminDetails.modifiedOn,
                    modifiedBy: adminDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Admin by Super Admin', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Admin by Super Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Admin by Super Admin', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.editAdminProfileBySuperAdmin = editAdminProfileBySuperAdmin;
let createStudentByAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails = req.body;
            const studentDetails = req.body;
            // Admin exist, proceed to create a new student
            const createStudent = new student_model_1.Student(studentDetails);
            // Save the student to the database
            const insertStudent = await createStudent.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-Admin', true, 200, { student: insertStudent }, 'Student created successfully by Admin.');
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
const editStudentProfileByAdmin = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails = req.body;
            const updateData = await student_model_1.Student.findOneAndUpdate({ _id: studentDetails._id }, {
                $set: {
                    name: studentDetails.name,
                    passportNo: studentDetails.passportNo,
                    expiryDate: studentDetails.expiryDate,
                    dob: studentDetails.dob,
                    citizenship: studentDetails.citizenship,
                    gender: studentDetails.gender,
                    whatsAppNumber: studentDetails.whatsAppNumber,
                    degreeName: studentDetails.degreeName,
                    academicYear: studentDetails.academicYear,
                    institution: studentDetails.institution,
                    percentage: studentDetails.percentage,
                    doHaveAnyEnglishLanguageTest: studentDetails.doHaveAnyEnglishLanguageTest,
                    englishTestType: studentDetails.englishTestType,
                    testScore: studentDetails.testScore,
                    dateOfTest: studentDetails.dateOfTest,
                    country: studentDetails.country,
                    desiredUniversity: studentDetails.desiredUniversity,
                    desiredCourse: studentDetails.desiredCourse,
                    workExperience: studentDetails.workExperience,
                    anyVisaRejections: studentDetails.anyVisaRejections,
                    visaReason: studentDetails.visaReason,
                    doYouHaveTravelHistory: studentDetails.doYouHaveTravelHistory,
                    travelReason: studentDetails.travelReason,
                    finance: studentDetails.finance,
                    twitter: studentDetails.twitter,
                    facebook: studentDetails.facebook,
                    instagram: studentDetails.instagram,
                    linkedIn: studentDetails.linkedIn,
                    photo: studentDetails.photo,
                    resume: studentDetails.resume,
                    passport: studentDetails.passport,
                    sslc: studentDetails.sslc,
                    hsc: studentDetails.hsc,
                    degree: studentDetails.degree,
                    additional: studentDetails.additional,
                    modifiedOn: studentDetails.modifiedOn,
                    modifiedBy: studentDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Student by Admin', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student by Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student by Admin', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.editStudentProfileByAdmin = editStudentProfileByAdmin;
let createStaffByAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails = req.body;
            const staffDetails = req.body;
            // Admin exist, proceed to create a new staff
            const createstaff = new staff_model_1.Staff(staffDetails);
            // Save the staff to the database
            const insertStaff = await createstaff.save();
            // Respond with success message
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', true, 200, { staff: insertStaff }, 'Staff created successfully by Admin.');
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
const editStaffProfileByAdmin = async (req, res) => {
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
                    modifiedOn: new Date(),
                    modifiedBy: staffDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Staff by Admin', true, 200, staffData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Staff by Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Staff by Admin', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.editStaffProfileByAdmin = editStaffProfileByAdmin;
//# sourceMappingURL=admin.controller.js.map