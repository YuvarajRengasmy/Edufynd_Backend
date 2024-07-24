"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredStudentBySuperAdmin = exports.editStudentProfileBySuperAdmin = exports.createStudentBySuperAdmin = exports.csvToJson = exports.getFilteredStudent = exports.deleteStudent = exports.updateStudent = exports.saveStudent = exports.getSingleStudent = exports.getAllStudent = void 0;
const student_model_1 = require("../model/student.model");
const express_validator_1 = require("express-validator");
const TokenManager = require("../utils/tokenManager");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const Encryption_1 = require("../helper/Encryption");
const csv = require("csvtojson");
const config = require("../config");
var activity = "Student";
let getAllStudent = async (req, res, next) => {
    try {
        const data = await student_model_1.Student.find({ isDeleted: false }).sort({ studentCode: -1 });
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
        const newHash = await (0, Encryption_1.decrypt)(student["password"]);
        const newHash1 = await (0, Encryption_1.decrypt)(student["confirmPassword"]);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Student', true, 200, { ...student.toObject(), password: newHash, confirmPassword: newHash1 }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleStudent = getSingleStudent;
// const generateNextStudentCode = async (): Promise<string> => {
//     // Retrieve all applicant IDs to determine the highest existing applicant counter
//     const student = await Student.find({}, 'studentCode').exec();
//     const maxCounter = student.reduce((max, app) => {
//         const appCode = app.studentCode;
//         const parts = appCode.split('_')
//         if (parts.length === 2) {
//             const counter = parseInt(parts[1], 10)
//             return counter > max ? counter : max;
//         }
//         return max;
//     }, 100);
//     // Increment the counter
//     const newCounter = maxCounter + 1;
//     // Format the counter as a string with leading zeros
//     const formattedCounter = String(newCounter).padStart(3, '0');
//     // Return the new Applicantion Code
//     return `ST_${formattedCounter}`;
// };
const generateNextStudentCode = async (currentMaxCounter) => {
    // Increment the counter
    const newCounter = currentMaxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new client ID
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
                studentDetails.createdOn = new Date();
                const student = await student_model_1.Student.find({}, 'studentCode').exec();
                const maxCounter = student.reduce((max, app) => {
                    const appCode = app.studentCode;
                    const parts = appCode.split('_');
                    if (parts.length === 2) {
                        const counter = parseInt(parts[1], 10);
                        return counter > max ? counter : max;
                    }
                    return max;
                }, 100);
                let currentMaxCounter = maxCounter;
                studentDetails.studentCode = await generateNextStudentCode(currentMaxCounter);
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
            if (req.files && req.files['photo']) {
                studentDetails.photo = `${req.protocol}://${req.get('host')}/uploads/${req.files['photo'][0].filename}`;
            }
            if (req.files && req.files['resume']) {
                studentDetails.resume = `${req.protocol}://${req.get('host')}/uploads/${req.files['resume'][0].filename}`;
            }
            if (req.files && req.files['passport']) {
                studentDetails.passport = `${req.protocol}://${req.get('host')}/uploads/${req.files['passport'][0].filename}`;
            }
            if (req.files && req.files['sslc']) {
                studentDetails.sslc = `${req.protocol}://${req.get('host')}/uploads/${req.files['sslc'][0].filename}`;
            }
            if (req.files && req.files['hsc']) {
                studentDetails.hsc = `${req.protocol}://${req.get('host')}/uploads/${req.files['hsc'][0].filename}`;
            }
            if (req.files && req.files['degree']) {
                studentDetails.degree = req.files['degree'].map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            }
            if (req.files && req.files['additional']) {
                studentDetails.additional = req.files['additional'].map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            }
            const updateFields = {
                name: studentDetails.name,
                passportNo: studentDetails.passportNo,
                expiryDate: studentDetails.expiryDate,
                dob: studentDetails.dob,
                citizenship: studentDetails.citizenship,
                gender: studentDetails.gender,
                whatsAppNumber: studentDetails.whatsAppNumber,
                primaryNumber: studentDetails.primaryNumber,
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
                duration: studentDetails.duration,
                lastEmployeer: studentDetails.lastEmployeer,
                lastDesignation: studentDetails.lastDesignation,
                date: studentDetails.date,
                purpose: studentDetails.purpose,
                countryName: studentDetails.countryName,
                dateVisa: studentDetails.dateVisa,
                purposeVisa: studentDetails.purposeVisa,
                countryNameVisa: studentDetails.countryNameVisa,
                modifiedOn: new Date(),
                modifiedBy: studentDetails.modifiedBy,
            };
            // Conditionally add file fields to updateFields
            if (studentDetails.photo)
                updateFields.photo = studentDetails.photo;
            if (studentDetails.resume)
                updateFields.resume = studentDetails.resume;
            if (studentDetails.passport)
                updateFields.passport = studentDetails.passport;
            if (studentDetails.sslc)
                updateFields.sslc = studentDetails.sslc;
            if (studentDetails.hsc)
                updateFields.hsc = studentDetails.hsc;
            if (studentDetails.degree)
                updateFields.degree = studentDetails.degree;
            if (studentDetails.additional)
                updateFields.additional = studentDetails.additional;
            const updateData = await student_model_1.Student.findOneAndUpdate({ _id: req.body._id }, { $set: updateFields }, { new: true });
            (0, commonResponseHandler_1.response)(req, res, 'Update-Student', 'Level-2', 'Update-Student', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, 'Update-Student', 'Level-3', 'Update-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, 'Update-Student', 'Level-3', 'Update-Student', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateStudent = updateStudent;
let deleteStudent = async (req, res, next) => {
    try {
        let id = req.query._id;
        const student = await student_model_1.Student.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Student', true, 200, student, 'Successfully Remove the Student');
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
        const studentList = await student_model_1.Student.find(findQuery).sort({ studentCode: -1 }).limit(limit).skip(page);
        const studentCount = await student_model_1.Student.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterStudent', true, 200, { studentList, studentCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterStudent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredStudent = getFilteredStudent;
// export let getFilteredStudent = async (req, res, next) => {
//     try {
//         let findQuery = {};
//         let andList = [];
//         let limit = req.body.limit ? parseInt(req.body.limit) : 10;
//         let page = req.body.page ? parseInt(req.body.page) : 1;
//         andList.push({ isDeleted: false });
//         andList.push({ status: 1 });
//         if (req.body.studentCode) {
//             andList.push({ studentCode: req.body.studentCode });
//         }
//         if (req.body.name) {
//             andList.push({ name: req.body.name });
//         }
//         if (req.body.passportNo) {
//             andList.push({ passportNo: req.body.passportNo });
//         }
//         if (req.body.email) {
//             andList.push({ email: req.body.email });
//         }
//         if (req.body.mobileNumber) {
//             andList.push({ mobileNumber: req.body.mobileNumber });
//         }
//         findQuery = andList.length > 0 ? { $and: andList } : {};
//         const studentList = await Student.find(findQuery)
//             .sort({ createdAt: -1 }) // Sort by createdAt in descending order
//             .limit(limit)
//             .skip((page - 1) * limit);
//         const studentCount = await Student.countDocuments(findQuery);
//         response(req, res,activity, 'Get-FilterStudent', 'Level-1', true, 200, { studentList, studentCount }, clientError.success.fetchedSuccessfully);
//     } catch (err) {
//         response(req, res,activity, 'Get-FilterStudent', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
//     }
// };
const csvToJson = async (req, res) => {
    try {
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);
        const student = await student_model_1.Student.find({}, 'studentCode').exec();
        const maxCounter = student.reduce((max, app) => {
            const appCode = app.studentCode;
            const parts = appCode.split('_');
            if (parts.length === 2) {
                const counter = parseInt(parts[1], 10);
                return counter > max ? counter : max;
            }
            return max;
        }, 100);
        let currentMaxCounter = maxCounter;
        // Process CSV data
        let studentList = [];
        for (const data of csvData) {
            const studentCode = await generateNextStudentCode(currentMaxCounter);
            currentMaxCounter++;
            studentList.push({
                studentCode: studentCode,
                name: data.Name,
                email: data.Email,
                mobileNumber: data.MobileNumber,
                whatsAppNumber: data.WhatsAppNumber,
                gender: data.GreGmatRequirementender,
                dob: data.DOB,
                source: data.Source,
                passportNo: data.PassportNo,
                expiryDate: data.ExpiryDate,
                citizenship: data.Citizenship,
                highestQualification: data.HighestQualification,
                degreeName: data.DegreeName,
                academicYear: data.AcademicYear,
                yearPassed: data.YearPassed,
                institution: data.Institution,
                percentage: data.Percentage,
                country: data.Country,
                desiredUniversity: data.DesiredUniversity,
                desiredCourse: data.DesiredCourse,
                doHaveAnyEnglishLanguageTest: data.DoHaveAnyEnglishLanguageTest,
                englishTestType: data.EnglishTestType,
                testScore: data.TestScore,
                dateOfTest: data.DateOfTest,
                workExperience: data.WorkExperience,
                anyVisaRejections: data.AnyVisaRejections,
                visaReason: data.VisaReason,
                doYouHaveTravelHistory: data.DoYouHaveTravelHistory,
                travelReason: data.TravelReason,
                finance: data.Finance,
                twitter: data.Twitter,
                instagram: data.Instagram,
                facebook: data.Facebook,
                linkedIn: data.LinkedIn,
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
let createStudentBySuperAdmin = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails = req.body;
            const student = await student_model_1.Student.find({}, 'studentCode').exec();
            const maxCounter = student.reduce((max, app) => {
                const appCode = app.studentCode;
                const parts = appCode.split('_');
                if (parts.length === 2) {
                    const counter = parseInt(parts[1], 10);
                    return counter > max ? counter : max;
                }
                return max;
            }, 100);
            let currentMaxCounter = maxCounter;
            studentDetails.studentCode = await generateNextStudentCode(currentMaxCounter);
            // Generate random passwords
            const password = (0, Encryption_1.generateRandomPassword)(8);
            const confirmPassword = password; // Since password and confirmPassword should match
            studentDetails.password = await (0, Encryption_1.encrypt)(password);
            studentDetails.confirmPassword = await (0, Encryption_1.encrypt)(confirmPassword);
            studentDetails.createdOn = new Date();
            const createStudent = new student_model_1.Student(studentDetails);
            const insertStudent = await createStudent.save();
            const newHash = await (0, Encryption_1.decrypt)(insertStudent["password"]);
            const mailOptions = {
                from: config.SERVER.EMAIL_USER,
                to: insertStudent.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertStudent.name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertStudent.email}\nPassword: ${newHash}\n\nPlease change your password after logging in for the first time.\n\nBest regards\nAfynd Private Limited\nChennai.`
            };
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
            console.log(err);
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
                    duration: studentDetails.duration,
                    lastEmployeer: studentDetails.lastEmployeer,
                    lastDesignation: studentDetails.lastDesignation,
                    date: studentDetails.date,
                    purpose: studentDetails.purpose,
                    countryName: studentDetails.countryName,
                    modifiedOn: new Date(),
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
//# sourceMappingURL=student.controller.js.map