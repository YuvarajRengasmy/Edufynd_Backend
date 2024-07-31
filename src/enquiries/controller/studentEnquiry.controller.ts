import { StudentEnquiry, StudentEnquiryDocument } from '../model/studentEnquiry.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../../utils/tokenManager";
import { response, transporter } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import csv = require("csvtojson")

var activity = "StudentEnquiry";



export let getAllStudentEnquiry = async (req, res, next) => {
    try {
        const data = await StudentEnquiry.find({ isDeleted: false }).sort({ studentCode: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-StudentEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-StudentEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleStudentEnquiry = async (req, res, next) => {
    try {
        const student = await StudentEnquiry.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-StudentEnquiry', true, 200, student, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-StudentEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


const generateNextStudentCode = async (): Promise<string> => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const student = await StudentEnquiry.find({}, 'studentCode').exec();

    //  if (student.length === 0) {
    //     // If no student codes exist, start with ST_101
    //     return 'ST_101';
    //   }
    const maxCounter = student.reduce((max, app) => {
        const appCode = app.studentCode;
        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `SR_${formattedCounter}`;
};


export let createStudentEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const enquiryDetails: StudentEnquiryDocument = req.body;
            enquiryDetails.createdOn = new Date();
            enquiryDetails.studentCode = await generateNextStudentCode();
            const createData = new StudentEnquiry(enquiryDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'StudentEnquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'StudentEnquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'StudentEnquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateStudentEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentEnquiryDetails: StudentEnquiryDocument = req.body;
            const updateData = await StudentEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    source: studentEnquiryDetails.source,
                    name: studentEnquiryDetails.name,
                    dob: studentEnquiryDetails.dob,
                    passportNo: studentEnquiryDetails.passportNo,
                    qualification: studentEnquiryDetails.qualification,
                    whatsAppNumber: studentEnquiryDetails.whatsAppNumber,
                    primaryNumber: studentEnquiryDetails.primaryNumber,
                    email: studentEnquiryDetails.email,
                    cgpa: studentEnquiryDetails.cgpa,
                    yearPassed: studentEnquiryDetails.yearPassed,
                    desiredCountry: studentEnquiryDetails.desiredCountry,
                    desiredCourse: studentEnquiryDetails.desiredCourse,
                    doYouNeedSupportForLoan: studentEnquiryDetails.doYouNeedSupportForLoan,
                    assignedTo: studentEnquiryDetails.assignedTo,
                    message: studentEnquiryDetails.message,


                    // New Added Field
                    gender: studentEnquiryDetails.gender,
                    citizenShip: studentEnquiryDetails.citizenShip,
                    expiryDate: studentEnquiryDetails.expiryDate,
                    desiredUniversity: studentEnquiryDetails.desiredUniversity,
                    doYouHoldAnyOtherOffer: studentEnquiryDetails.doYouHoldAnyOtherOffer,
                    country: studentEnquiryDetails.country,
                    universityName: studentEnquiryDetails.universityName,
                    programName: studentEnquiryDetails.programName,
                    refereeName: studentEnquiryDetails.refereeName,
                    refereeContactNo: studentEnquiryDetails.refereeContactNo,
                    registerForIELTSClass: studentEnquiryDetails.registerForIELTSClass,
                    studentId: studentEnquiryDetails.studentId,
                 


                    modifiedOn: new Date(),
                    modifiedBy: studentEnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-studentEnquiryDetails', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-studentEnquiryDetails', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-studentEnquiryDetails', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteStudentEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const student = await StudentEnquiry.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-student Enquiry Details', true, 200, student, 'Successfully Remove student Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-student Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredStudentEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.studentCode) {
            andList.push({ studentCode: req.body.studentCode })
        }
        if (req.body.name) {
            andList.push({ name: req.body.name })
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const studentList = await StudentEnquiry.find(findQuery).sort({ studentCode: -1 }).limit(limit).skip(page)

        const studentCount = await StudentEnquiry.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStudentEnquiry', true, 200, { studentList, studentCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterStudentEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



