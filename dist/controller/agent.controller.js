"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToJson = exports.getFilteredStudentByAgent = exports.deleteStudentByAgent = exports.editStudentProfileByAgent = exports.viewStudentProfileByAgent = exports.createStudentProfileByAgent = exports.deleteAgent = exports.updateAgent = exports.createAgent = exports.getSingleAgent = exports.getAllAgent = void 0;
const agent_model_1 = require("../model/agent.model");
const student_model_1 = require("../model/student.model");
const express_validator_1 = require("express-validator");
const TokenManager = require("../utils/tokenManager");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
const csv = require("csvtojson");
var activity = "Agent";
let getAllAgent = async (req, res, next) => {
    try {
        const data = await agent_model_1.Agent.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Agent', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllAgent = getAllAgent;
let getSingleAgent = async (req, res, next) => {
    try {
        const agent = await agent_model_1.Agent.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Agent', true, 200, agent, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleAgent = getSingleAgent;
const generateNextAgentID = async () => {
    // Retrieve all client IDs to determine the highest existing client counter
    const agents = await agent_model_1.Agent.find({}, 'agentCode').exec();
    const maxCounter = agents.reduce((max, agent) => {
        const agentCode = agent.agentCode;
        const counter = parseInt(agentCode.split('_')[1], 10);
        return counter > max ? counter : max;
    }, 0);
    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new client ID
    return `AG_${formattedCounter}`;
};
let createAgent = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const agent = await agent_model_1.Agent.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!agent) {
                req.body.password = await (0, Encryption_1.encrypt)(req.body.password);
                req.body.confirmPassword = await (0, Encryption_1.encrypt)(req.body.confirmPassword);
                const agentDetails = req.body;
                // const createData = new Agent(agentDetails);
                agentDetails.agentCode = await generateNextAgentID();
                const createData = new agent_model_1.Agent(agentDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'agent'
                });
                const result = {};
                result['_id'] = insertData._id;
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'agent';
                finalResult["agentDetails"] = result;
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Agent', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Agent', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Agent', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createAgent = createAgent;
let updateAgent = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const agentDetails = req.body;
            const updateData = await agent_model_1.Agent.findOneAndUpdate({ _id: agentDetails._id }, {
                $set: {
                    businessName: agentDetails.businessName,
                    whatsAppNumber: agentDetails.whatsAppNumber,
                    bankDetail: agentDetails.bankDetail,
                    panNumberIndividual: agentDetails.panNumberIndividual,
                    panNumberCompany: agentDetails.panNumberCompany,
                    gstn: agentDetails.gstn,
                    inc: agentDetails.inc,
                    agentsCommission: agentDetails.agentsCommission,
                    agentBusinessLogo: agentDetails.agentBusinessLogo,
                    countryInterested: agentDetails.countryInterested,
                    privileges: agentDetails.privileges,
                    addressLine1: agentDetails.addressLine1,
                    addressLine2: agentDetails.addressLine2,
                    addressLine3: agentDetails.addressLine3,
                    staffName: agentDetails.staffName,
                    staffContactNo: agentDetails.staffContactNo,
                    modifiedOn: agentDetails.modifiedOn,
                    modifiedBy: agentDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Agent', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Agent', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateAgent = updateAgent;
let deleteAgent = async (req, res, next) => {
    try {
        const agent = await agent_model_1.Agent.findOneAndDelete({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Agent', true, 200, agent, 'Successfully Agent University');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteAgent = deleteAgent;
const createStudentProfileByAgent = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails = req.body;
            const agentId = req.agent._id;
            const newStudent = new student_model_1.Student({ ...studentDetails, agentId: agentId });
            await newStudent.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-Agent', true, 200, newStudent, 'Student created successfully by agent.');
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-Agent', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-Agent', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createStudentProfileByAgent = createStudentProfileByAgent;
const viewStudentProfileByAgent = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const studentId = await student_model_1.Student.find({ _id: req.query.studentId });
            const student = await student_model_1.Student.findById(studentId).populate('agentId', 'name email');
            if (!student) {
                return res.status(400).json({ success: false, message: 'Student Not Found' });
            }
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'View Student by Agent', true, 200, student, ErrorMessage_1.clientError.success.fetchedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'View-Student-By-Agent', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'View-Student-By-Agent', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.viewStudentProfileByAgent = viewStudentProfileByAgent;
const editStudentProfileByAgent = async (req, res) => {
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
                    modifiedOn: studentDetails.modifiedOn,
                    modifiedBy: studentDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Student by Agent', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student by Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student by Agent', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.editStudentProfileByAgent = editStudentProfileByAgent;
let deleteStudentByAgent = async (req, res, next) => {
    try {
        let id = req.query.studentId;
        const student = await student_model_1.Student.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Student by Agent', true, 200, student, 'Successfully Remove Student by Agent');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Student by Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteStudentByAgent = deleteStudentByAgent;
let getFilteredStudentByAgent = async (req, res, next) => {
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
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const agentList = await agent_model_1.Agent.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 });
        const agentCount = await agent_model_1.Agent.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter', true, 200, { agentList, agentCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredStudentByAgent = getFilteredStudentByAgent;
const csvToJson = async (req, res) => {
    try {
        let agentList = [];
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);
        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            agentList.push({
                agentName: csvData[i].AgentName,
                businessName: csvData[i].BusinessName,
                email: csvData[i].Email,
                mobileNumber: csvData[i].MobileNumber,
                whatsAppNumber: csvData[i].WhatsAppNumber,
                addressLine1: csvData[i].addressLine1,
                addressLine2: csvData[i].addressLine2,
                addressLine3: csvData[i].addressLine3,
                panNumberIndividual: csvData[i].PanNumberIndividual,
                panNumberCompany: csvData[i].PanNumberCompany,
                gstn: csvData[i].GSTN,
                inc: csvData[i].INC,
                staffName: csvData[i].StaffName,
                staffContactNo: csvData[i].StaffContactNo,
                agentsCommission: csvData[i].AcademicRequirementgentsCommission,
                countryInterested: csvData[i].CountryInterested,
            });
        }
        // Insert into the database
        await agent_model_1.Agent.insertMany(agentList);
        // Send success response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for agent module', true, 200, { agentList }, 'Successfully CSV File Store Into Database');
    }
    catch (err) {
        console.error(err);
        // Send error response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for agent module', false, 500, {}, 'Internal Server Error', err.message);
    }
};
exports.csvToJson = csvToJson;
//# sourceMappingURL=agent.controller.js.map