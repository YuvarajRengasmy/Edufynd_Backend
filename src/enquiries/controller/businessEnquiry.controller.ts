import { BusinessEnquiry,BusinessEnquiryDocument} from '../model/businessEnquiry.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "BusinessEnquiry";



export let getAllBusinessEnquiry = async (req, res, next) => {
    try {
        const data = await BusinessEnquiry.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Business Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Business Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleBusinessEnquiry = async (req, res, next) => {
    try {
        const data = await BusinessEnquiry.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Business Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Business Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let createBusinessEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
                const contactDetails: BusinessEnquiryDocument = req.body;
                const createData = new BusinessEnquiry(contactDetails);
                let insertData = await createData.save();
             
                response(req, res, activity, 'Level-2', 'Business Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Business Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Business Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateBusinessEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails: BusinessEnquiryDocument = req.body;
            const updateData = await BusinessEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                 
                    name: EnquiryDetails.name,
                    email: EnquiryDetails.email,
                    mobileNumber:  EnquiryDetails.mobileNumber,
                    message:  EnquiryDetails.message,
                    studentId: EnquiryDetails.studentId,
                    country: EnquiryDetails.country,
                    universityName: EnquiryDetails.universityName,
                  
                    modifiedOn: new Date(),
                    modifiedBy: EnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Business Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Business Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Business Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteBusinessEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await BusinessEnquiry.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Business Enquiry Details', true, 200, data, 'Successfully Remove Business Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Business Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredBusinessEnquiry = async (req, res, next) => {
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

        const businessEnquiryList = await BusinessEnquiry.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const businessEnquiryCount = await BusinessEnquiry.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Business Enquiry', true, 200, { businessEnquiryList, businessEnquiryCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Business Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};