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


export let createApplicant = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentDetails: StudentDocument = req.body;
            const universityDetails: UniversityDocument = req.body;

            const applicant = await Student.findOne({ $and: [{ isDeleted: false }, { email: studentDetails.email }] });
            const university = await University.findOne({ $and: [{ isDeleted: false }, { universityID: universityDetails._id }] });

            if (applicant) {
                const applicantDetails: ApplicantDocument = req.body;

                const createData = new Applicant(applicantDetails);
                let insertData = await createData.save();

                const studentData = {}
                studentData['name'] = applicant.name
                studentData['email'] = applicant.email

                const universityData = {}
                universityData['_id'] = university._id
                universityData['universityName'] = university.universityName

                const final = { studentData, universityData }
                response(req, res, activity, 'Level-2', 'Save-Applicant', true, 200, final, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Applicant', true, 422, {}, 'No email Id found');
            }

        } catch (err: any) {

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
                   
                    anyVisaRejections: applicantDetails.anyVisaRejections,
                    feesPaid:applicantDetails.feesPaid,
                    assignTo:applicantDetails.assignTo,
                    status:  applicantDetails.status,
                    modifiedOn: applicantDetails.modifiedOn,
                    modifiedBy:  applicantDetails.modifiedBy,
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


export const getApplicantDetails = async (req, res) => {
    try {
        // Extract the applicant ID from request parameters
        const applicantId = req.params.applicantId;

        // Find the applicant by ID and populate the referenced fields
        const applicant = await Applicant.findById(applicantId).populate('name', 'dob passportNo email primaryNumber')
            .populate('selectCourse.universityName', 'name location');

      
        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        // Send the response with the applicant's details
        return res.status(200).json({ applicant });
    } catch (error) {
      
        return res.status(500).json({ error: error.message });
    }
};
