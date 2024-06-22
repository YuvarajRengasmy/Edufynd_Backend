"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.editStudentProfileBySuperAdmin = exports.createStudentBySuperAdmin = exports.csvToJson = exports.getFilteredStudentBySuperAdmin = exports.getFilteredStudent = exports.deleteStudent = exports.updateStudent = exports.saveStudent = exports.getSingleStudent = exports.getAllStudent = void 0;
const student_model_1 = require("../model/student.model");
const express_validator_1 = require("express-validator");
const TokenManager = require("../utils/tokenManager");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
const uuid_1 = require("uuid");
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
const generateNextStudentCode = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const student = await student_model_1.Student.find({}, 'studentCode').exec();
    console.log("ll", student);
    const maxCounter = student.reduce((max, app) => {
        console.log("mm", app);
        const appCode = app.studentCode;
        console.log("kk", appCode);
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
    return `ST_${formattedCounter}`;
};
let saveStudent = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const student = await student_model_1.Student.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!student) {
                req.body.password = await (0, Encryption_1.encrypt)(req.body.password);
                req.body.confirmPassword = await (0, Encryption_1.encrypt)(req.body.confirmPassword);
                const studentDetails = req.body;
                studentDetails.studentCode = await generateNextStudentCode();
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
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Student', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveStudent = saveStudent;
let updateStudent = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails = req.body;
            // Handling file uploads
            if (req.files['photo']) {
                studentDetails.photo = `${req.protocol}://${req.get('host')}/uploads/${req.files['photo'][0].filename}`;
            }
            if (req.files['resume']) {
                studentDetails.resume = `${req.protocol}://${req.get('host')}/uploads/${req.files['resume'][0].filename}`;
            }
            if (req.files['passport']) {
                studentDetails.passport = `${req.protocol}://${req.get('host')}/uploads/${req.files['passport'][0].filename}`;
            }
            if (req.files['sslc']) {
                studentDetails.sslc = `${req.protocol}://${req.get('host')}/uploads/${req.files['sslc'][0].filename}`;
            }
            if (req.files['hsc']) {
                studentDetails.hsc = `${req.protocol}://${req.get('host')}/uploads/${req.files['hsc'][0].filename}`;
            }
            if (req.files['degree']) {
                studentDetails.degree = req.files['degree'].map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            }
            if (req.files['additional']) {
                studentDetails.additional = req.files['additional'].map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            }
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
let getFilteredStudent = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.studentCode) {
            andList.push({ studentCode: req.body.studentCode });
        }
        if (req.body.name) {
            andList.push({ name: req.body.name });
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo });
        }
        if (req.body.email) {
            andList.push({ email: req.body.email });
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const studentList = await student_model_1.Student.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const studentCount = await student_model_1.Student.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterStudent', true, 200, { studentList, studentCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterStudent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredStudent = getFilteredStudent;
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
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Generates a random 8-character password
};
let createStudentBySuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails = req.body;
            // const superAdminDetails: SuperAdminDocument = req.body;
            // const superAdmin = await SuperAdmin.findOne({ _id: req.query._id })
            // const randomPassword = generateRandomPassword();
            // if (!superAdmin) {
            //     return res.status(400).json({ success: false, message: 'Super Admin ID is required' });
            // }
            studentDetails.studentCode = await generateNextStudentCode();
            const createStudent = new student_model_1.Student(studentDetails);
            const insertStudent = await createStudent.save();
            console.log("lll", insertStudent);
            const mailOptions = {
                from: 'balan9133civil@gmail.com',
                to: insertStudent.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertStudent.name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertStudent.email}\nPassword: ${insertStudent.password}\n\nPlease change your password after logging in for the first time.\n\nThank you!`
            };
            console.log("kk", mailOptions);
            commonResponseHandler_1.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                }
                else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Student profile created and email sent login credentials', student: insertStudent });
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', true, 200, {
                student: insertStudent,
            }, 'Student created successfully by SuperAdmin.');
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};
exports.createStudentBySuperAdmin = createStudentBySuperAdmin;
const editStudentProfileBySuperAdmin = async (req, res) => {
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
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Student by Super Admin', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student by Super Admin', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Student by Super Admin', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.editStudentProfileBySuperAdmin = editStudentProfileBySuperAdmin;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const student = await student_model_1.Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const otp = (0, uuid_1.v4)().slice(0, 6); // Generate a 6-character OTP
        student.resetOtp = otp;
        student.resetOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour
        await student.save();
        const mailOptions = {
            from: 'balan9133civil@gmail.com',
            to: student.email,
            subject: 'Password Reset Request',
            text: `Hello ${student.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 1 hour.\n\nThank you!`
        };
        console.log("kk", mailOptions);
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
    catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=student.controller.js.map