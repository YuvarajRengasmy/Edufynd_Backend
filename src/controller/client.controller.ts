import { Client, ClientDocument } from '../model/client.model'
import { Logs } from "../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import csv = require('csvtojson')

var activity = "Client";

export let getAllClient = async (req, res, next) => {
    try {
        const data = await Client.find({ isDeleted: false }).sort({clientID: -1});
        response(req, res, activity, 'Level-1', 'GetAll-Client', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Client', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getAllLoggedClient = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Client" })
        response(req, res, activity, 'Level-1', 'All-Logged Client', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Client', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleLoggedClient = async (req, res) => {
    try {
        const { _id } = req.query;

        // Fetch logs that match the documentId
        const logs = await Logs.find({ documentId: _id });

        // If no logs are found, return a 404 response and stop further execution
        if (!logs || logs.length === 0) {
            return response(req, res, activity, 'Level-3', 'Single-Logged Client', false, 404, {}, "No logs found.");
        }

        // If logs are found, return a 200 response with logs data
        return response(req, res, activity, 'Level-1', 'Single-Logged Client', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        // Handle errors and send a 500 response, then stop execution
        return response(req, res, activity, 'Level-2', 'Single-Logged Client', false, 500, {}, errorMessage.internalServer, err.message);
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


const generateNextClientID = async (currentMaxCounter): Promise<string> => {
    const newCounter = currentMaxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    return `CL_${formattedCounter}`;
};

export let saveClient = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const clientDetails: ClientDocument = req.body; 
            // Generate the next client ID
            const clients = await Client.find({}, 'clientID').exec();
            const maxCounter = clients.reduce((max, client) => {
                const clientID = client.clientID;
                const counter = parseInt(clientID.split('_')[1], 10);
                return counter > max ? counter : max;
            }, 100);
            let currentMaxCounter = maxCounter;
            clientDetails.createdOn = new Date();
            clientDetails.clientID = await generateNextClientID(currentMaxCounter);
            
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
                    whatsAppNumber: clientDetails.whatsAppNumber,
                    website: clientDetails.website,
                    country: clientDetails.country,
                    lga: clientDetails.lga,
                    state: clientDetails.state,
                    addressLine1: clientDetails.addressLine1,
                    addressLine2: clientDetails.addressLine2,
                    addressLine3: clientDetails.addressLine3,
                    name: clientDetails.name,
                    dial1: clientDetails.dial1,
                    dial2: clientDetails.dial2,
                    dial3: clientDetails.dial3,
               
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
        if (req.body.businessContactNo) {
            andList.push({ businessContactNo: req.body.businessContactNo })
        }
        if (req.body.emailID) {
            andList.push({ emailID: req.body.emailID })
        }
        if (req.body.clientID) {
            andList.push({ clientID: req.body.clientID })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const clientList = await Client.find(findQuery).sort({clientID: -1}).limit(limit).skip(page)

        const clientCount = await Client.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterClient', true, 200, { clientList, clientCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterClient', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export const csvToJson = async (req, res) => {
    try {
        const clientDetails: ClientDocument = req.body;
        const csvData = await csv().fromFile(req.file.path);
        const clients = await Client.find({}, 'clientID').exec();
        const maxCounter = clients.reduce((max, client) => {
            const clientID = client.clientID;
            const counter = parseInt(clientID.split('_')[1], 10);
            return counter > max ? counter : max;
        }, 100);

        let currentMaxCounter = maxCounter;

        // Process CSV data
        const clientList = [];
        for (const data of csvData) {
            const clientID = await generateNextClientID(currentMaxCounter);
            currentMaxCounter++; // Increment the counter for the next client ID
            clientList.push({
                clientID: clientID,
                typeOfClient: data.TypeOfClient,
                clientStatus: data.ClientStatus,
                businessMailID: data.BusinessMailID,
                businessContactNo: data.BusinessContactNo,
                website: data.Website,
                whatAppNumber: data.WhatAppNumber,
                addressLine1: data.AddressLine1,
                addressLine2: data.AddressLine2,
                addressLine3: data.AddressLine3,
                name: data.StaffName,
                contactNo: data.StaffContactNo,
                emailID: data.StaffMailId,
                staffStatus: data.staffStatus,
            });

        }

        // Insert into the database
        await Client.insertMany(clientList);
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for client module', true, 200, { clientList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for client module', false, 500, {}, 'Internal Server Error', err.message);
    }
}


export const editClientProfileBySuperAdmin = async (req, res) => {
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
                    whatsAppNumber: clientDetails.whatsAppNumber,
                    website: clientDetails.website,
                    country: clientDetails.country,
                    lga: clientDetails.lga,
                    state: clientDetails.state,
                    addressLine1: clientDetails.addressLine1,
                    addressLine2: clientDetails.addressLine2,
                    addressLine3: clientDetails.addressLine3,
                    name: clientDetails.name,
                    dial1: clientDetails.dial1,
                    dial2: clientDetails.dial2,
                    dial3: clientDetails.dial3,
               
                    contactNo: clientDetails.contactNo,
                    emailID: clientDetails.emailID,
                    staffStatus: clientDetails.staffStatus,
                    privileges: clientDetails.privileges,
                    modifiedOn: new Date(),
                    modifiedBy: clientDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Client-By-SuperAdmin', true, 200, clientData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Client-By-SuperAdmin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Client-By-SuperAdmin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let activeClient = async (req, res, next) => {
    try {
        const clientIds = req.body.clientIds; // Array of client IDs

        // Update all clients whose IDs are in clientIds to set isActive to true
        const clients = await Client.updateMany(
            { _id: { $in: clientIds } }, // Match any client whose _id is in the clientIds array
            { $set: { isActive: "Active" } }, // Set isActive to true for all matched clients
            { new: true }
        );

        if (clients.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-Client', true, 200, clients, 'Successfully Activated Clients.');
        } else {
            response(req, res, activity, 'Level-3', 'Active-Client', false, 400, {}, 'No clients were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-Client', false, 500, {}, 'Internal Server Error', err.message);
    }
};


export let deactivateClient = async (req, res, next) => {
    try {
      const clientIds = req.body.clientIds; // Array of client IDs to deactivate
  
      // Update all clients whose IDs are in clientIds to set isActive to false
      const clients = await Client.updateMany(
        { _id: { $in: clientIds } }, // Match clients with the given IDs
        { $set: { isActive: "InActive" } }, // Set isActive to false
        { new: true }
      );
  
      if (clients.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-Client', true, 200, clients, 'Successfully deactivated clients.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-Client', false, 400, {}, 'No clients were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-Client', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  