import { Applicant, ApplicantDocument } from '../model/application.model'
import { Student, StudentDocument } from '../model/student.model'
import { University, UniversityDocument } from '../model/university.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Applicant";



export let getAllApplicant = async (req, res, next) => {
    try {
        const data = await Applicant.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Applicant', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleApplicant = async (req, res, next) => {
    try {
        const applicant = await Applicant.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Applicant', true, 200, applicant, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



const generateNextApplicationCode = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const applicants = await Applicant.find({}, 'applicationCode').exec();
    const maxCounter = applicants.reduce((max, app) => {
        const appCode = app.applicationCode;
        const parts = appCode.split('_');
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10);
            return counter > max ? counter : max;
        }
        return max;
    }, 0);

    // Increment the counter
    const newCounter = maxCounter + 1;

    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');

    // Return the new Application Code
    return `AP_${formattedCounter}`;
};



export let createApplicant = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails: StudentDocument = req.body;
            const universityDetails: UniversityDocument = req.body;

            const applicant = await Student.findOne({ $and: [{ isDeleted: false }, { email: studentDetails.email }] });
          
            const university = await University.findOne({ $and: [{ isDeleted: false }, { universityId: universityDetails._id }] });

            if (applicant) {
                const applicantDetails: ApplicantDocument = req.body;

        applicantDetails.applicationCode = await generateNextApplicationCode();

                const createData = new Applicant(applicantDetails);
                let insertData = await createData.save();

                const studentData = {}
                studentData['name'] = applicant.name
                studentData['email'] = applicant.email

                const universityData = {}
                universityData['_id'] = university._id
                universityData['universityName'] = university.universityName

                const final = { studentData, universityData }
                response(req, res, activity, 'Level-2', 'Save-Applicant', true, 200, final, clientError.success.application);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Applicant', true, 422, {}, 'No email Id found');
            }

        } catch (err: any) {
console.log(err)
            response(req, res, activity, 'Level-3', 'Save-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Save-Applicant', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let updateApplicant = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            let applicantData = await Applicant.findByIdAndUpdate({ _id: applicantDetails._id }, {
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
                    modifiedOn: applicantDetails.modifiedOn,
                    modifiedBy: applicantDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Applicant', true, 200, applicantData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Applicant', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let deleteApplicant = async (req, res, next) => {

    try {
        const applicant = await Applicant.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-2', 'Delete-Applicant', true, 200, applicant, 'Successfully Remove Applicant');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



/**
 * @author Balan K K
 * @date 28-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter Staff Details
 */

export let getFilteredApplication = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId })
        }
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.feesPaid) {
            andList.push({ feesPaid: req.body.feesPaid })
        }
        if (req.body.anyVisaRejections) {
            andList.push({ anyVisaRejections: req.body.anyVisaRejections })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const applicantList = await Applicant.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const applicantCount = await Applicant.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterApplicant', true, 200, { applicantList, applicantCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterApplicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


