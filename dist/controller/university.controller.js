"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniversityWithProgramDetails = exports.csvToJson = exports.getFilteredUniversityForStudent = exports.getFilteredUniversityForAgent = exports.getFilteredUniversity = exports.getAllUniversityForWeb = exports.deleteUniversity = exports.updateUniversity = exports.saveUniversity = exports.getSingleUniversity = exports.getAllUniversity = void 0;
const university_model_1 = require("../model/university.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const csv = require("csvtojson");
var activity = "University";
let getAllUniversity = async (req, res, next) => {
    try {
        const data = await university_model_1.University.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-University', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-University', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllUniversity = getAllUniversity;
let getSingleUniversity = async (req, res, next) => {
    try {
        const student = await university_model_1.University.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-University', true, 200, student, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-University', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleUniversity = getSingleUniversity;
let saveUniversity = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const universityDetails = req.body;
            const createData = new university_model_1.University(universityDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-University', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            console.log(err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-University', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-University', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveUniversity = saveUniversity;
let updateUniversity = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const universityDetails = req.body;
            let universityData = await university_model_1.University.findByIdAndUpdate({ _id: universityDetails._id }, {
                $set: {
                    universityName: universityDetails.universityName,
                    businessName: universityDetails.businessName,
                    banner: universityDetails.banner,
                    universityLogo: universityDetails.universityLogo,
                    countryName: universityDetails.countryName,
                    courseType: universityDetails.courseType,
                    country: universityDetails.country,
                    flag: universityDetails.flag,
                    state: universityDetails.state,
                    lga: universityDetails.lga,
                    ranking: universityDetails.ranking,
                    averageFees: universityDetails.averageFees,
                    popularCategories: universityDetails.popularCategories,
                    admissionRequirement: universityDetails.admissionRequirement,
                    offerTAT: universityDetails.offerTAT,
                    founded: universityDetails.founded,
                    institutionType: universityDetails.institutionType,
                    applicationFees: universityDetails.applicationFees,
                    costOfLiving: universityDetails.costOfLiving,
                    grossTuition: universityDetails.grossTuition,
                    paymentMethod: universityDetails.paymentMethod,
                    amount: universityDetails.amount,
                    percentage: universityDetails.percentage,
                    eligibilityForCommission: universityDetails.eligibilityForCommission,
                    currency: universityDetails.currency,
                    paymentTAT: universityDetails.paymentTAT,
                    tax: universityDetails.tax,
                    commissionPaidOn: universityDetails.commissionPaidOn,
                    modifiedOn: universityDetails.modifiedOn,
                    modifiedBy: universityDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-University', true, 200, universityData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-University', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-University', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateUniversity = updateUniversity;
let deleteUniversity = async (req, res, next) => {
    try {
        const university = await university_model_1.University.findOneAndDelete({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-University', true, 200, university, 'Successfully Remove University');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-University', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteUniversity = deleteUniversity;
/**
 * @author Balan K K
 * @date   16-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get All University For Web
 */
let getAllUniversityForWeb = async (req, res, next) => {
    try {
        const universityDetails = await university_model_1.University.find({ isDeleted: false }).sort({ createdAt: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-University', true, 200, universityDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-University', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllUniversityForWeb = getAllUniversityForWeb;
/**
 * @author Balan K K
 * @date 16-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter University Details
 */
let getFilteredUniversity = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId });
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName });
        }
        if (req.body.businessName) {
            andList.push({ businessName: req.body.businessName });
        }
        if (req.body.country) {
            andList.push({ country: req.body.country });
        }
        if (req.body.campus) {
            andList.push({ campus: req.body.campus });
        }
        if (req.body.ranking) {
            andList.push({ ranking: req.body.ranking });
        }
        if (req.body.popularCategories) {
            andList.push({ popularCategories: req.body.popularCategories });
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const universityList = await university_model_1.University.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const universityCount = await university_model_1.University.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterUniversity', true, 200, { universityList, universityCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterUniversity', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredUniversity = getFilteredUniversity;
/**
 * @author Balan K K
 * @date 16-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter University Details for Agent
 */
let getFilteredUniversityForAgent = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId });
        }
        if (req.body.agentId) {
            andList.push({ agentId: req.body.agentId });
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName });
        }
        if (req.body.businessName) {
            andList.push({ businessName: req.body.businessName });
        }
        if (req.body.country) {
            andList.push({ country: req.body.country });
        }
        if (req.body.campus) {
            andList.push({ campus: req.body.campus });
        }
        if (req.body.ranking) {
            andList.push({ ranking: req.body.ranking });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const universityList = await university_model_1.University.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('agentId', { name: 1, email: 1, mobileNumber: 1 }); //.populate('companyId',{companyName:1});
        const universityCount = await university_model_1.University.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterUniversity-Agent', true, 200, { universityList, universityCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterUniversity-Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredUniversityForAgent = getFilteredUniversityForAgent;
/**
 * @author Balan K K
 * @date 15-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter University Details for Student
 */
let getFilteredUniversityForStudent = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId });
        }
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId });
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName });
        }
        if (req.body.clientName) {
            andList.push({ clientName: req.body.clientName });
        }
        if (req.body.country) {
            andList.push({ country: req.body.country });
        }
        if (req.body.state) {
            andList.push({ state: req.body.state });
        }
        if (req.body.city) {
            andList.push({ city: req.body.city });
        }
        if (req.body.ranking) {
            andList.push({ ranking: req.body.ranking });
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const universityList = await university_model_1.University.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 }); //.populate('companyId',{companyName:1});
        const universityCount = await university_model_1.University.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterUniversity-Agent', true, 200, { universityList, universityCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterUniversity-Agent', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredUniversityForStudent = getFilteredUniversityForStudent;
/**
 * @author Balan K K
 * @date 16-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used CSV file to JSON and Store to Database
 */
const csvToJson = async (req, res) => {
    try {
        let universityList = [];
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);
        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            universityList.push({
                universityName: csvData[i].UniversityName,
                universityLogo: csvData[i].UniversityLogo,
                courseType: csvData[i].CourseType,
                businessName: csvData[i].BusinessName,
                banner: csvData[i].Banner,
                country: csvData[i].Country,
                countryName: csvData[i].CountryName,
                email: csvData[i].Email,
                // campus: csvData[i].Campus ? csvData[i].Campus.split(',') : [],
                ranking: csvData[i].Ranking,
                applicationFees: csvData[i].ApplicationFees,
                averageFees: csvData[i].AverageFees,
                popularCategories: csvData[i].PopularCategories ? csvData[i].PopularCategories.split(',') : [],
                offerTAT: csvData[i].OfferTAT,
                founded: csvData[i].Founded,
                institutionType: csvData[i].InstitutionType,
                costOfLiving: csvData[i].CostOfLiving,
                admissionRequirement: csvData[i].AdmissionRequirement,
                grossTuition: csvData[i].GrossTuition,
                flag: csvData[i].Flag,
                paymentMethod: csvData[i].PaymentMethod,
                amount: csvData[i].Amount,
                percentage: csvData[i].Percentage,
                eligibilityForCommission: csvData[i].EligibilityForCommission,
                currency: csvData[i].Currency,
                paymentTAT: csvData[i].PaymentTAT,
                tax: csvData[i].Tax,
                commissionPaidOn: csvData[i].CommissionPaidOn,
            });
        }
        // Insert into the database
        await university_model_1.University.insertMany(universityList);
        // Send success response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'CSV-File-Insert-Database', true, 200, { universityList }, 'Successfully CSV File Store Into Database');
    }
    catch (err) {
        console.error(err);
        // Send error response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'CSV-File-Insert-Database', false, 500, {}, 'Internal Server Error', err.message);
    }
};
exports.csvToJson = csvToJson;
////////////////////
const getUniversityWithProgramDetails = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const universityId = new mongoose.Types.ObjectId(req.query.universityId);
        console.log(typeof universityId);
        if (!universityId) {
            return res.status(400).json({ success: false, message: 'University ID is required' });
        }
        const aggregationPipeline = [
            {
                $match: { _id: universityId }
            },
            {
                $lookup: {
                    from: 'programs',
                    localField: '_id',
                    foreignField: 'universityId',
                    as: 'programDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    universityName: 1,
                    universityLogo: 1,
                    country: 1,
                    programDetails: {
                        programTitle: 1,
                        courseType: 1,
                        inTake: 1,
                        courseFee: 1,
                        campus: 1,
                    }
                }
            },
        ];
        const result = await university_model_1.University.aggregate(aggregationPipeline);
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }
        const university = result[0];
        const response = {
            success: true,
            data: {
                universityDetails: {
                    universityId: university._id.toString(),
                    universityName: university.universityName,
                    universityLogo: university.universityLogo,
                    country: university.country,
                    campus: university.campus,
                    programDetails: university.programDetails.map(program => ({
                        programTitle: program.programTitle,
                        courseType: program.courseType,
                        inTake: program.inTake,
                        courseFee: program.courseFee,
                        campus: program.campus
                    }))
                }
            }
        };
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getUniversityWithProgramDetails = getUniversityWithProgramDetails;
