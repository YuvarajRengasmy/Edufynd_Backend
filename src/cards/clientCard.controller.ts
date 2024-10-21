import { Client, ClientDocument } from '../model/client.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as mongoose from 'mongoose';

var activity = "Client Cards";

export let getAllClientCardDetails = async (req, res, next) => {
    try {
        mongoose.set('debug', false);
        // Find all client that are not deleted
        const client = await Client.find()


        // Number of unique countries
        const uniqueCountries = await Client.distinct("country");
        const clientcount = await Client.distinct("typeOfClient")
        const totalUniqueCountries = uniqueCountries.length;
        const totalClient = clientcount.length;

        // Active and inactive 
        const activeClient = await Client.countDocuments({ isActive: "Active"});
        const inactiveClient = await Client.countDocuments({ isActive: "InActive"});
        const accommodation = await Client.countDocuments({ typeOfClient: "Accommodation"});
        const flight = await Client.countDocuments({ typeOfClient: "Flight"});
        const forex = await Client.countDocuments({ typeOfClient: "Forex"});
        const education = await Client.countDocuments({ typeOfClient: "Educational Institute"});
        const finance = await Client.countDocuments({ typeOfClient: "Financial Institute"});
        const loan = await Client.countDocuments({ typeOfClient: "loan"});

        mongoose.set('debug', true);

        // Construct the response data
        const responseData = {
            totalClient,
            totalUniqueCountries,
            activeClient,
            inactiveClient,
            accommodation,
            flight,
            forex,
            education,
            finance,
            loan
         
        };

        // Send the response
        response(req, res, activity, 'Level-1', 'GetAll-Client Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Client Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};