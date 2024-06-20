"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToJson = exports.deleteClient = exports.updateClient = exports.saveClient = exports.getSingleClient = exports.getAllClient = void 0;
const client_model_1 = require("../model/client.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const csv = require("csvtojson");
var activity = "Client";
let getAllClient = async (req, res, next) => {
    try {
        const data = await client_model_1.Client.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Client', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Client', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllClient = getAllClient;
let getSingleClient = async (req, res, next) => {
    try {
        const client = await client_model_1.Client.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Client', true, 200, client, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Client', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleClient = getSingleClient;
const generateNextClientID = async () => {
    // Retrieve all client IDs to determine the highest existing client counter
    const clients = await client_model_1.Client.find({}, 'clientID').exec();
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
let saveClient = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const clientDetails = req.body;
            // Generate the next client ID
            clientDetails.clientID = await generateNextClientID();
            const createData = new client_model_1.Client(clientDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Client', 'Level-2', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Client', 'Level-3', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Save-Client', 'Level-3', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveClient = saveClient;
let updateClient = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const clientDetails = req.body;
            let clientData = await client_model_1.Client.findByIdAndUpdate({ _id: clientDetails._id }, {
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
                    modifiedOn: clientDetails.modifiedOn,
                    modifiedBy: clientDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Client', true, 200, clientData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Client', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Client', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateClient = updateClient;
let deleteClient = async (req, res, next) => {
    try {
        const client = await client_model_1.Client.findOneAndDelete({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Client', true, 200, client, 'Successfully Remove Client');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Client', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteClient = deleteClient;
const csvToJson = async (req, res) => {
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
                contactNo: csvData[i].StaffContactNo,
                emailID: csvData[i].StaffMailId,
                staffStatus: csvData[i].staffStatus,
            });
        }
        // Insert into the database
        await client_model_1.Client.insertMany(clientList);
        // Send success response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for client module', true, 200, { clientList }, 'Successfully CSV File Store Into Database');
    }
    catch (err) {
        // Send error response
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for client module', false, 500, {}, 'Internal Server Error', err.message);
    }
};
exports.csvToJson = csvToJson;
//# sourceMappingURL=client.controller.js.map