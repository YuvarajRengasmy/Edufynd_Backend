"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredApplication = exports.deleteApplicant = exports.updateApplicant = exports.createApplicant = exports.getSingleApplicant = exports.getAllApplicant = void 0;
const application_model_1 = require("../model/application.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Applicant";
let getAllApplicant = async (req, res, next) => {
    try {
        const data = await application_model_1.Applicant.find({ isDeleted: false }).sort({ applicationCode: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Applicant', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Applicant', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllApplicant = getAllApplicant;
let getSingleApplicant = async (req, res, next) => {
    try {
        const applicant = await application_model_1.Applicant.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Applicant', true, 200, applicant, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Applicant', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleApplicant = getSingleApplicant;
const generateNextApplicationCode = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const applicant = await application_model_1.Applicant.find({}, 'applicationCode').exec();
    const maxCounter = applicant.reduce((max, app) => {
        const appCode = app.applicationCode;
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
    return `AP_${formattedCounter}`;
};
let createApplicant = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails = req.body;
            // Generate the next client ID
            applicantDetails.applicationCode = await generateNextApplicationCode();
            const createData = new application_model_1.Applicant(applicantDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Applicant', 'Level-2', true, 200, insertData, ErrorMessage_1.clientError.success.application);
        }
        catch (err) {
            console.log(err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Applicant', 'Level-3', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Applicant', 'Level-3', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createApplicant = createApplicant;
// export let createApplicant = async (req, res, next) => {
//     console.log("bbb")
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const studentDetails: StudentDocument = req.body;
//             const universityDetails: UniversityDocument = req.body;
//             const applicant = await Student.findOne({ $and: [{ isDeleted: false }, { email: studentDetails.email }] });
//             const university = await University.findOne({ $and: [{ isDeleted: false }, { universityId: universityDetails._id }] });
//             if (applicant) {
//                 const applicantDetails: ApplicantDocument = req.body;
//                  applicantDetails.applicationCode = await generateNextApplicationCode();
//                 const createData = new Applicant(applicantDetails);
//                 let insertData = await createData.save();
//                 const studentData = {}
//                 studentData['name'] = applicant.name
//                 studentData['email'] = applicant.email
//                 const universityData = {}
//                 universityData['_id'] = university._id
//                 universityData['universityName'] = university.universityName
//                 const final = { studentData, universityData }
//                 response(req, res, activity, 'Level-2', 'Save-Applicant', true, 200, final, clientError.success.application);
//             }
//             else {
//                 response(req, res, activity, 'Level-3', 'Save-Applicant', true, 422, {}, 'No email Id found');
//             }
//         } catch (err: any) {
// console.log(err)
//             response(req, res, activity, 'Level-3', 'Save-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Save-Applicant', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }
let updateApplicant = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails = req.body;
            let applicantData = await application_model_1.Applicant.findByIdAndUpdate({ _id: applicantDetails._id }, {
                $set: {
                    applicationCode: applicantDetails.applicationCode,
                    name: applicantDetails.name,
                    dob: applicantDetails.dob,
                    passportNo: applicantDetails.passportNo,
                    email: applicantDetails.email,
                    primaryNumber: applicantDetails.primaryNumber,
                    whatsAppNumber: applicantDetails.whatsAppNumber,
                    inTake: applicantDetails.inTake,
                    universityName: applicantDetails.universityName,
                    campus: applicantDetails.campus,
                    course: applicantDetails.course,
                    courseFees: applicantDetails.courseFees,
                    anyVisaRejections: applicantDetails.anyVisaRejections,
                    feesPaid: applicantDetails.feesPaid,
                    assignTo: applicantDetails.assignTo,
                    status: applicantDetails.status,
                    modifiedOn: new Date(),
                    modifiedBy: applicantDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Applicant', true, 200, applicantData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Applicant', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Applicant', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateApplicant = updateApplicant;
let deleteApplicant = async (req, res, next) => {
    try {
        const applicant = await application_model_1.Applicant.findOneAndDelete({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Applicant', true, 200, applicant, 'Successfully Remove Applicant');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Applicant', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteApplicant = deleteApplicant;
/**
 * @author Balan K K
 * @date 28-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter Staff Details
 */
let getFilteredApplication = async (req, res, next) => {
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
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId });
        }
        if (req.body.feesPaid) {
            andList.push({ feesPaid: req.body.feesPaid });
        }
        if (req.body.anyVisaRejections) {
            andList.push({ anyVisaRejections: req.body.anyVisaRejections });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const applicantList = await application_model_1.Applicant.find(findQuery).sort({ applicationCode: -1 }).limit(limit).skip(page);
        const applicantCount = await application_model_1.Applicant.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterApplicant', true, 200, { applicantList, applicantCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterApplicant', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredApplication = getFilteredApplication;
//# sourceMappingURL=applicant.controller.js.map