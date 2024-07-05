import { Client, ClientDocument } from '../model/client.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import csv = require('csvtojson')



var activity = "Client";



export let getAllClient = async (req, res, next) => {
    try {
        const data = await Client.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Client', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Client', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Client', true, 200, client, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Client', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

const generateNextClientID = async (): Promise<string> => {
    // Retrieve all client IDs to determine the highest existing client counter
    const clients = await Client.find({}, 'clientID').exec();
    const maxCounter = clients.reduce((max, client) => {
        const clientID = client.clientID;
        const counter = parseInt(clientID.split('_')[1], 10);
        return counter > max ? counter : max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;

    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');

    // Return the new client ID
    return `CL_${formattedCounter}`;
};

export let saveClient = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const clientDetails: ClientDocument = req.body;

            // Generate the next client ID
            clientDetails.clientID = await generateNextClientID();
            const createData = new Client(clientDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Save-Client', 'Level-2', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Save-Client', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Save-Client', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};




export let updateClient = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const clientDetails: ClientDocument = req.body;
            let clientData = await Client.findByIdAndUpdate({ _id: clientDetails._id }, {
                $set: {

                    typeOfClient: clientDetails.typeOfClient,
                    businessName: clientDetails.businessName,
                    businessMailID: clientDetails.businessMailID,
                    clientStatus: clientDetails.clientStatus,
                    businessContactNo: clientDetails.businessContactNo,
                    website: clientDetails.website,
                    addressLine1: clientDetails.addressLine1,
                    addressLine2: clientDetails.addressLine2,
                    addressLine3: clientDetails.addressLine3,
                    name: clientDetails.name,
                    contactNo: clientDetails.contactNo,
                    emailID: clientDetails.emailID,
                    staffStatus: clientDetails.staffStatus,
                    privileges: clientDetails.privileges,
                    modifiedOn: new Date(),
                    modifiedBy: clientDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Client', true, 200, clientData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Client', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Client', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let deleteClient = async (req, res, next) => {

    try {
        const client = await Client.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-2', 'Delete-Client', true, 200, client, 'Successfully Remove Client');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Client', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredClient = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.typeOfClient) {
            andList.push({ typeOfClient: req.body.typeOfClient })
        }
        if (req.body.clientID) {
            andList.push({ clientID: req.body.clientID })
        }
        if (req.body.businessName) {
            andList.push({ businessName: req.body.businessName })
        }
        
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const clientList = await Client.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const clientCount = await Client.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterClient', true, 200, { clientList, clientCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterClient', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export const csvToJson = async (req, res) => {
    try {
        let clientList = [];
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);

        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            clientList.push({
                typeOfClient: csvData[i].TypeOfClient,  
                clientStatus: csvData[i].ClientStatus,
                businessMailID: csvData[i].BusinessMailID,
                businessContactNo: csvData[i].BusinessContactNo,
                website: csvData[i].Website,
                gstn: csvData[i].GST,
                addressLine1: csvData[i].AddressLine1, 
                addressLine2: csvData[i].AddressLine2, 
                addressLine3: csvData[i].AddressLine3, 
                name: csvData[i].StaffName,
                contactNo:csvData[i].StaffContactNo,
                emailID: csvData[i].StaffMailId,
                staffStatus: csvData[i].staffStatus,

            });
        }

        // Insert into the database
        await Client.insertMany(clientList);
        // Send success response
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for client module', true, 200, { clientList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        // Send error response
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for client module', false, 500, {}, 'Internal Server Error', err.message);
    }
};
