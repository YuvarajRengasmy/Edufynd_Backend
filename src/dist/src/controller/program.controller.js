"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgramApplications = exports.getProgramDetailsByUniversity = exports.getProgramsByUniversityName = exports.csvToJson = exports.getFilteredProgramForAppliedStudent = exports.getFilteredProgram = exports.getAllProgramForWeb = exports.deleteProgram = exports.updateProgram = exports.createProgram = exports.getSingleProgram = exports.getAllProgram = void 0;
const program_model_1 = require("../model/program.model");
const university_model_1 = require("../model/university.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const csv = require("csvtojson");
var activity = "Program";
const getAllProgram = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        const program = await program_model_1.Program.find({ isDeleted: false });
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const programList = await program_model_1.Program.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const programCount = await program_model_1.Program.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Program', true, 200, { programList, programCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Program', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllProgram = getAllProgram;
const getSingleProgram = async (req, res, next) => {
    try {
        const program = await program_model_1.Program.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-Program', true, 200, program, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetSingle-Program', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleProgram = getSingleProgram;
const generateNextProgramCode = async (currentMaxCounter) => {
    // Increment the counter
    const newCounter = currentMaxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new client ID
    return `PG_${formattedCounter}`;
};
let createProgram = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const programDetails = req.body;
            const program = await program_model_1.Program.find({}, 'programCode').exec();
            const maxCounter = program.reduce((max, app) => {
                const appCode = app.programCode;
                const parts = appCode.split('_');
                if (parts.length === 2) {
                    const counter = parseInt(parts[1], 10);
                    return counter > max ? counter : max;
                }
                return max;
            }, 100);
            let currentMaxCounter = maxCounter;
            programDetails.programCode = await generateNextProgramCode(currentMaxCounter);
            programDetails.finalValue = (programDetails.applicationFee) - (programDetails.discountedValue);
            const createData = new program_model_1.Program(programDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-Program', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            console.log(err);
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Program', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-Program', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createProgram = createProgram;
let updateProgram = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const programDetails = req.body;
            let updateData = await program_model_1.Program.findByIdAndUpdate({ _id: programDetails._id }, {
                $set: {
                    universityName: programDetails.universityName,
                    country: programDetails.country,
                    courseType: programDetails.courseType,
                    programTitle: programDetails.programTitle,
                    applicationFee: programDetails.applicationFee,
                    currency: programDetails.currency,
                    flag: programDetails.flag,
                    discountedValue: programDetails.discountedValue,
                    campuses: programDetails.campuses,
                    popularCategories: programDetails.popularCategories,
                    // courseFee: programDetails.courseFee,
                    // inTake: programDetails.inTake,
                    // duration: programDetails.duration,
                    englishlanguageTest: programDetails.englishlanguageTest,
                    universityInterview: programDetails.universityInterview,
                    greGmatRequirement: programDetails.greGmatRequirement,
                    academicRequirement: programDetails.academicRequirement,
                    commission: programDetails.commission,
                    modifiedOn: new Date(),
                    modifiedBy: programDetails.modifiedBy,
                },
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Program', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Program', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Program', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateProgram = updateProgram;
let deleteProgram = async (req, res, next) => {
    try {
        const program = await program_model_1.Program.findOneAndDelete({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Program', true, 200, program, 'Successfully Remove Program');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Program', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteProgram = deleteProgram;
/**
 * @author Balan K K
 * @date   17-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get All Program For Web
 */
let getAllProgramForWeb = async (req, res, next) => {
    try {
        const programDetails = await program_model_1.Program.find({ isDeleted: false }).sort({ createdAt: -1 });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-All-Program for web', true, 200, programDetails, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-All-Program for web', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllProgramForWeb = getAllProgramForWeb;
/**
 * @author Balan K K
 * @date 15-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter Program Details
 */
let getFilteredProgram = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName });
        }
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId });
        }
        if (req.body.country) {
            andList.push({ country: req.body.country });
        }
        if (req.body.campus) {
            andList.push({ campus: req.body.campus });
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType });
        }
        if (req.body.programTitle) {
            andList.push({ programTitle: req.body.programTitle });
        }
        if (req.body.universityInterview) {
            andList.push({ universityInterview: req.body.universityInterview });
        }
        if (req.body.englishlanguageTest) {
            andList.push({ englishlanguageTest: req.body.englishlanguageTest });
        }
        if (req.body.courseFee) {
            andList.push({ courseFee: req.body.courseFee });
        }
        if (req.body.inTake) {
            andList.push({ inTake: req.body.inTake });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const programList = await program_model_1.Program.find(findQuery).sort({ programCode: -1 }).limit(limit).skip(page);
        const programCount = await program_model_1.Program.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterProgram', true, 200, { programList, programCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterProgram', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredProgram = getFilteredProgram;
/**
 * @author Balan K K
 * @date 15-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to get filter Program Details for Applied student
 */
let getFilteredProgramForAppliedStudent = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.appliedStudentId) {
            andList.push({ appliedStudentId: req.body.appliedStudentId });
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName });
        }
        if (req.body.programTitle) {
            andList.push({ programTitle: req.body.programTitle });
        }
        if (req.body.country) {
            andList.push({ country: req.body.country });
        }
        if (req.body.campus) {
            andList.push({ campus: req.body.campus });
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const programList = await program_model_1.Program.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 }).populate('universityName');
        const programCount = await program_model_1.Program.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-FilterProgram For Applied-Student', true, 200, { programList, programCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-FilterProgram For Applied-Student', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredProgramForAppliedStudent = getFilteredProgramForAppliedStudent;
/**
 * @author Balan K K
 * @date 20-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used CSV file to JSON and Store to Database
 */
const csvToJson = async (req, res) => {
    try {
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);
        const program = await program_model_1.Program.find({}, 'programCode').exec();
        const maxCounter = program.reduce((max, app) => {
            const programCode = app.programCode;
            const counter = parseInt(programCode.split('_')[1], 10);
            return counter > max ? counter : max;
        }, 100);
        let currentMaxCounter = maxCounter;
        // Process CSV data
        let programList = [];
        for (const data of csvData) {
            const programCode = await generateNextProgramCode(currentMaxCounter);
            currentMaxCounter++;
            programList.push({
                programCode: programCode,
                universityName: data.UniversityName,
                campus: data.Campus ? data.Campus.split(',') : [],
                applicationFee: data.ApplicationFee,
                country: data.Country,
                courseType: data.CourseType ? data.CourseType.split(',') : [],
                programTitle: data.ProgramTitle,
                currency: data.Currency,
                flag: data.Flag,
                discountedValue: data.DiscountedValue,
                courseFee: data.CourseFee,
                inTake: data.InTake ? data.InTake.split(',') : [],
                duration: data.Duration,
                englishlanguageTest: data.EnglishlanguageTest,
                textBox: data.TextBox,
                universityInterview: data.UniversityInterview,
                greGmatRequirement: data.GreGmatRequirement,
                score: data.Score,
                academicRequirement: data.AcademicRequirement,
                commission: data.Commission,
            });
        }
        // Insert into the database
        await program_model_1.Program.insertMany(programList);
        // Send success response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'CSV-File-Insert-Database', true, 200, { programList }, 'Successfully CSV File Store Into Database');
    }
    catch (err) {
        console.error(err);
        // Send error response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'CSV-File-Insert-Database', false, 500, {}, 'Internal Server Error', err.message);
    }
};
exports.csvToJson = csvToJson;
/**
 * @author Balan K K
 * @date 23-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to filter the particular university details with that program detail
 */
const getProgramsByUniversityName = async (req, res) => {
    try {
        const universityId = req.query.universityId;
        if (!universityId) {
            return res.status(400).json({ success: false, message: 'University ID is required' });
        }
        const university = await university_model_1.University.findById(universityId).lean();
        if (!university) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }
        const programs = await program_model_1.Program.find({ universityId: university._id })
            .select('programTitle courseType inTake courseFee campus')
            .lean();
        const response = {
            success: true,
            data: {
                universityDetails: {
                    universityId: university._id,
                    universityName: university.universityName,
                    universityLogo: university.universityLogo,
                    country: university.country,
                    programDetails: programs.map(program => ({
                        programTitle: program.programTitle,
                        // courseFee: program.courseFee,
                        // inTake: program.inTake,
                        campuses: program.campuses,
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
exports.getProgramsByUniversityName = getProgramsByUniversityName;
// export let getProgramDetailsByUniversity = async (req, res, next) => {
//     try {
//         var findQuery;
//         var andList: any = []
//         var limit = req.body.limit ? req.body.limit : 0;
//         var page = req.body.page ? req.body.page : 0;
//         andList.push({ isDeleted: false })
//         andList.push({ status: 1 })      
//         if (req.body.universityId) {
//             andList.push({ universityId: req.body.universityId })
//         }
//         findQuery = (andList.length > 0) ? { $and: andList } : {}
//         const programList = await Program.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('universityId',{universityLogo:1});
//         const programCount = await Program.find(findQuery).count()
//         response(req, res, activity, 'Level-1', 'Get-Program-Details By University', true, 200, { programList, programCount }, clientError.success.fetchedSuccessfully);
//     } catch (err: any) {
//         response(req, res, activity, 'Level-3', 'Get-Program-Details By University', false, 500, {}, errorMessage.internalServer, err.message);
//     }
// };
const getProgramDetailsByUniversity = async (req, res, next) => {
    try {
        const { limit, page, universityId } = req.body;
        const findQuery = {
            isDeleted: false,
            universityId: universityId
        };
        const programList = await program_model_1.Program.find(findQuery)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page)
            .populate('universityId', { universityName: 1 });
        const programCount = await program_model_1.Program.countDocuments(findQuery);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetUniversityProgram', true, 200, { programList, programCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetUniversityProgram', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getProgramDetailsByUniversity = getProgramDetailsByUniversity;
const updateProgramApplications = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const { programId, studentId } = req.body;
            // Check if the student is already applied
            const program = await program_model_1.Program.findOne({ _id: programId, appliedStudentId: studentId });
            if (program) {
                // Student already applied, remove the student
                const updatedProgram = await program_model_1.Program.findByIdAndUpdate(programId, {
                    $pull: { appliedStudentId: studentId }
                }, { new: true });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Program-Applications', true, 200, updatedProgram, 'Student application removed successfully');
            }
            else {
                // Student not applied, add the student
                const updatedProgram = await program_model_1.Program.findByIdAndUpdate(programId, {
                    $addToSet: { appliedStudentId: studentId }
                }, { new: true });
                (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Program-Applications', true, 200, updatedProgram, 'Student applied successfully');
            }
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Program-Applications', false, 500, {}, 'Internal server error', err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Program-Applications', false, 422, {}, 'Field validation error', JSON.stringify(errors.mapped()));
    }
};
exports.updateProgramApplications = updateProgramApplications;
//# sourceMappingURL=program.controller.js.map