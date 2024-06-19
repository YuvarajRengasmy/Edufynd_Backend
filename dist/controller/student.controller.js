"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToJson = exports.getFilteredStudentBySuperAdmin = exports.deleteStudent = exports.updateStudent = exports.saveStudent = exports.getSingleStudent = exports.getAllStudent = void 0;
const student_model_1 = require("../model/student.model");
const express_validator_1 = require("express-validator");
const TokenManager = require("../utils/tokenManager");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
const csv = require("csvtojson");
var activity = "Student";
let getAllStudent = async (req, res, next) => {
    try {
        const data = await student_model_1.Student.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Student', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllStudent = getAllStudent;
let getSingleStudent = async (req, res, next) => {
    try {
        const student = await student_model_1.Student.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Student', true, 200, student, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleStudent = getSingleStudent;
let saveStudent = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const student = await student_model_1.Student.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!student) {
                req.body.password = await (0, Encryption_1.encrypt)(req.body.password);
                req.body.confirmPassword = await (0, Encryption_1.encrypt)(req.body.confirmPassword);
                const studentDetails = req.body;
                const uniqueId = Math.floor(Math.random() * 10000);
                studentDetails.studentCode = studentDetails.name + "_" + uniqueId;
                const createData = new student_model_1.Student(studentDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'student'
                });
                const result = {};
                result['_id'] = insertData._id;
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'student';
                finalResult["studentDetails"] = result;
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Student', true, 200, finalResult, ErrorMessage_1.clientError.success.registerSuccessfully);
            }
            else {
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Student', true, 422, {}, 'Email already registered');
            }
        }
        catch (err) {
            console.log(err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-User', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveStudent = saveStudent;
let updateStudent = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails = req.body;
            const updateData = await student_model_1.Student.findOneAndUpdate({ _id: req.body._id }, {
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
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Student', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateStudent = updateStudent;
let deleteStudent = async (req, res, next) => {
    try {
        let id = req.query._id;
        const student = await student_model_1.Student.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Student', true, 200, student, 'Successfully Remove User');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteStudent = deleteStudent;
let getFilteredStudentBySuperAdmin = async (req, res, next) => {
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
        if (req.body.superAdminId) {
            andList.push({ superAdminId: req.body.superAdminId });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const studentList = await student_model_1.Student.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { StudentName: 1, email: 1, mobileNumber: 1 });
        const studentCount = await student_model_1.Student.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter', true, 200, { studentList, studentCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredStudentBySuperAdmin = getFilteredStudentBySuperAdmin;
const csvToJson = async (req, res) => {
    try {
        let studentList = [];
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);
        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            studentList.push({
                name: csvData[i].Name,
                email: csvData[i].Email,
                mobileNumber: csvData[i].MobileNumber,
                whatsAppNumber: csvData[i].WhatsAppNumber,
                gender: csvData[i].GreGmatRequirementender,
                dob: csvData[i].DOB,
                source: csvData[i].Source,
                passportNo: csvData[i].PassportNo,
                expiryDate: csvData[i].ExpiryDate,
                citizenship: csvData[i].Citizenship,
                highestQualification: csvData[i].HighestQualification,
                degreeName: csvData[i].DegreeName,
                academicYear: csvData[i].AcademicYear,
                yearPassed: csvData[i].YearPassed,
                institution: csvData[i].Institution,
                percentage: csvData[i].Percentage,
                country: csvData[i].Country,
                desiredUniversity: csvData[i].DesiredUniversity,
                desiredCourse: csvData[i].DesiredCourse,
                doHaveAnyEnglishLanguageTest: csvData[i].DoHaveAnyEnglishLanguageTest,
                englishTestType: csvData[i].EnglishTestType,
                testScore: csvData[i].TestScore,
                dateOfTest: csvData[i].DateOfTest,
                workExperience: csvData[i].WorkExperience,
                anyVisaRejections: csvData[i].AnyVisaRejections,
                visaReason: csvData[i].VisaReason,
                doYouHaveTravelHistory: csvData[i].DoYouHaveTravelHistory,
                travelReason: csvData[i].TravelReason,
                finance: csvData[i].Finance,
                twitter: csvData[i].Twitter,
                instagram: csvData[i].Instagram,
                facebook: csvData[i].Facebook,
                linkedIn: csvData[i].LinkedIn,
            });
        }
        // Insert into the database
        await student_model_1.Student.insertMany(studentList);
        // Send success response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for student module', true, 200, { studentList }, 'Successfully CSV File Store Into Database');
    }
    catch (err) {
        console.error(err);
        // Send error response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for student module', false, 500, {}, 'Internal Server Error', err.message);
    }
};
exports.csvToJson = csvToJson;
//# sourceMappingURL=student.controller.js.map