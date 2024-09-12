import { Accommodation, AccommodationDocument } from '../model/accommodation.model'
import { validationResult } from "express-validator";
import { response} from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Accommodation_Enquiry";



export let getAllAccommodation = async (req, res, next) => {
    try {
        const data = await Accommodation.find({ isDeleted: false }).sort({ accommodationID: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-AccommodationEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-AccommodationEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleAccommodation = async (req, res, next) => {
    try {
        const accommodation = await Accommodation.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-AccommodationEnquiry', true, 200, accommodation, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Single-AccommodationEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

const generateNextAccommodationID = async (): Promise<string> => {
    const enquiry = await Accommodation.find({}, 'accommodationID').exec();
    const maxCounter = enquiry.reduce((max, app) => {
        const appCode = app.accommodationID;
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
    return `EA_${formattedCounter}`;
};



export let createAccommodation = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const accommodationDetails: AccommodationDocument = req.body;
            accommodationDetails.createdOn = new Date();
            accommodationDetails.accommodationID = await generateNextAccommodationID()
            const createData = new Accommodation(accommodationDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-1', 'Accommodation Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Accommodation Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Accommodation Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateAccommodation = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const accommodationDetails: AccommodationDocument = req.body;
            const updateData = await Accommodation.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    studentName: accommodationDetails.studentName,
                    source: accommodationDetails.source,
                    passportNumber: accommodationDetails.passportNumber,
                    expiryDate:accommodationDetails.expiryDate,
                    courseType: accommodationDetails.courseType,
                    whatsAppNumber:accommodationDetails.whatsAppNumber,
                    universityName: accommodationDetails.universityName,
                    final:accommodationDetails.final,
                    accommodationType: accommodationDetails.accommodationType,
                    agentName:accommodationDetails.agentName,
                    businessName:accommodationDetails.businessName,
                    agentWhatsAppNumber: accommodationDetails.agentWhatsAppNumber,
                    assignedTo: accommodationDetails.assignedTo,
                    message: accommodationDetails.message,
                    studentId: accommodationDetails.studentId,
                    country: accommodationDetails.country,
                    state:accommodationDetails.state,
                    lga: accommodationDetails.lga,
                    dial1: accommodationDetails.dial1,
                    dial2: accommodationDetails.dial2,
                    dial3: accommodationDetails.dial3,
                    dial4: accommodationDetails.dial4,
                    name:accommodationDetails.name,
                
                    modifiedOn: new Date(),
                    modifiedBy: accommodationDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-1', 'Update-Accommodation Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Accommodation Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Accommodation Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deleteAccommodationEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await Accommodation.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-1', 'Delete-Accommodation Enquiry Details', true, 200, loan, 'Successfully Remove Accommodation Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-2', 'Delete-Accommodation Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredAccommodation = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        // andList.push({ status: 1 })
        if (req.body.agentID) {
            andList.push({ agentID: req.body.agentID })
        }
        if (req.body.staffID) {
            andList.push({ staffID: req.body.staffID })
        }

        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.UniversityName) {
            andList.push({ UniversityName: req.body.UniversityName })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const accommodationList = await Accommodation.find(findQuery).sort({ accommodationID: -1 }).limit(limit).skip(page).populate({ path: 'adminId', select: 'name' }).populate({ path: 'staffId', select: 'name' })

        const accommodationCount = await Accommodation.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Accommodation Enquiry', true, 200, { accommodationList, accommodationCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Filter Accommodation Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



