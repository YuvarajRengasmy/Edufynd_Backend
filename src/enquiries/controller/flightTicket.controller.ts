import { Flight, FlightDocument } from '../model/flightTicket.model'
import { validationResult } from "express-validator";
import { response,} from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "FlightTicketEnquiry";



export let getAllFlightTicketEnquiry = async (req, res, next) => {
    try {
        const data = await Flight.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Flight Ticket Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Flight Ticket Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleFlightTicketEnquiry = async (req, res, next) => {
    try {
        const flight = await Flight.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Flight Ticket Enquiry', true, 200, flight, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Flight Ticket Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
const generateNextFlightId = async (): Promise<string> => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const forex = await Flight.find({}, 'flightID').exec();

    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.flightID;
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
    return `ET_${formattedCounter}`;
};



export let createFlightTicketEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const flightDetails: FlightDocument = req.body;
            flightDetails.createdOn = new Date();
            flightDetails.flightID = await generateNextFlightId()
            const createData = new Flight(flightDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'Flight Ticket Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Flight Ticket Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Flight Ticket Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateFlightTicketEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const flightEnquiryDetails: FlightDocument = req.body;
            const updateData = await Flight.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                
                    source:flightEnquiryDetails.source,
                    studentName: flightEnquiryDetails.studentName,
                    passportNo: flightEnquiryDetails.passportNo,
                    dob: flightEnquiryDetails.dob,
                    whatsAppNumber: flightEnquiryDetails.whatsAppNumber,
                    agentName: flightEnquiryDetails.agentName,
                    businessName: flightEnquiryDetails.businessName,
                    agentWhatsAppNumber: flightEnquiryDetails.agentWhatsAppNumber,
                    from: flightEnquiryDetails.from,
                    to: flightEnquiryDetails.to,
                    dateOfTravel: flightEnquiryDetails.dateOfTravel,
                    message: flightEnquiryDetails.message,
                    modifiedOn: new Date(),
                    modifiedBy:flightEnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Flight Ticket Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Flight Ticket Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Flight Ticket Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteFlightTicketEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await Flight.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Flight Ticket Enquiry Details', true, 200, loan, 'Successfully Remove Flight Ticket Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Flight Ticket Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredFlightTicketEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
       
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName })
        }
        if (req.body.from) {
            andList.push({ from: req.body.from })
        }
        if (req.body.to) {
            andList.push({ to: req.body.to })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const flightList = await Flight.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const flightCount = await Flight.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Flight Ticket Enquiry', true, 200, { flightList, flightCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Flight Ticket  Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



