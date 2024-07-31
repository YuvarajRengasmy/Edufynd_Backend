import { Forex, ForexDocument } from '../model/forex.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "ForexEnquiry";



export let getAllForexEnquiry = async (req, res, next) => {
    try {
        const data = await Forex.find({ isDeleted: false }).sort({ forexID: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Forex Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Forex Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleForexEnquiry = async (req, res, next) => {
    try {
        const forex = await Forex.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Forex Enquiry', true, 200, forex, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Forex Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
const generateNextForexId = async (): Promise<string> => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const forex = await Forex.find({}, 'forexID').exec();

    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.forexID;
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
    return `EF_${formattedCounter}`;
};

export let createForexEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const forexDetails: ForexDocument = req.body;
            forexDetails.createdOn = new Date();
            forexDetails.forexID = await generateNextForexId()
            const createData = new Forex(forexDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'Forex Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Forex Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Forex Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateForexEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const forexEnquiryDetails: ForexDocument = req.body;
            const updateData = await Forex.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    source: forexEnquiryDetails.source,
                    studentName: forexEnquiryDetails.studentName,
                    country: forexEnquiryDetails.country,
                    currency: forexEnquiryDetails.currency,
                    universityName: forexEnquiryDetails.universityName,
                    passportNo: forexEnquiryDetails.passportNo,
                    whatsAppNumber: forexEnquiryDetails.whatsAppNumber,
                    //If Agent request for the following
                    agentName: forexEnquiryDetails.agentName,
                    businessName: forexEnquiryDetails.businessName,
                    agentPrimaryNumber: forexEnquiryDetails.agentPrimaryNumber,
                    agentWhatsAppNumber: forexEnquiryDetails.agentWhatsAppNumber,
                    agentEmail: forexEnquiryDetails.agentEmail,
                    paymentType: forexEnquiryDetails.paymentType,
                    amountInCurrency: forexEnquiryDetails.amountInCurrency,
                    assignedTo: forexEnquiryDetails.assignedTo,
                    message: forexEnquiryDetails.message,
                    studentId: forexEnquiryDetails.studentId,
                

                    // New added Fields
                    expiryDate:forexEnquiryDetails.expiryDate,
                    courseType:forexEnquiryDetails.courseType,
                    value: forexEnquiryDetails.value,
                    markUp:forexEnquiryDetails.markUp,
                    profit: forexEnquiryDetails.profit,

                    modifiedOn: new Date(),
                    modifiedBy: forexEnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Forex Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Forex Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Forex Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteForexEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await Forex.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Forex Enquiry Details', true, 200, loan, 'Successfully Remove Forex Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Forex Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredForexEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.paymentType) {
            andList.push({ paymentType: req.body.paymentType })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const forexList = await Forex.find(findQuery).sort({ forexID: -1 }).limit(limit).skip(page)

        const forexCount = await Forex.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Forex Enquiry', true, 200, { forexList, forexCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Forex Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



