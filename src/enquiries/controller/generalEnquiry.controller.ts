import { GeneralEnquiry, GeneralEnquiryDocument } from '../model/generalEnquiry.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "GeneralEnquiry";



export let getAllGeneralEnquiry = async (req, res, next) => {
    try {
        const data = await GeneralEnquiry.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-General Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-General Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleGeneralEnquiry = async (req, res, next) => {
    try {
        const forex = await GeneralEnquiry.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-General Enquiry', true, 200, forex, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-General Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let createGeneralEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const contactDetails: GeneralEnquiryDocument = req.body;
            const createData = new GeneralEnquiry(contactDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'General Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'General Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'General Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateGeneralEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails: GeneralEnquiryDocument = req.body;
            const updateData = await GeneralEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {

                    name: EnquiryDetails.name,
                    email: EnquiryDetails.email,
                    mobileNumber: EnquiryDetails.mobileNumber,
                    message: EnquiryDetails.message,
                    typeOfUser: EnquiryDetails.typeOfUser,
                    studentId: EnquiryDetails.studentId,
                    country: EnquiryDetails.country,
                    universityName: EnquiryDetails.universityName,

                    modifiedOn: new Date(),
                    modifiedBy: EnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-LoanEnquiryDetails', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteGeneralEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await GeneralEnquiry.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-General Enquiry Details', true, 200, loan, 'Successfully Remove General Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-General Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredGeneralEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })

        if (req.body.name) {
            andList.push({ name: req.body.name })
        }

        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const generalEnquiryList = await GeneralEnquiry.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const generalEnquiryCount = await GeneralEnquiry.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter General Enquiry', true, 200, { generalEnquiryList, generalEnquiryCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter General Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
