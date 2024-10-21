import { Applicant, ApplicantDocument } from '../model/application.model'
import * as mongoose from 'mongoose';
import { validationResult } from "express-validator";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Applicantion";

export let getAllApplicantCardDetails = async (req, res, next) => {
    try {
        // Find all client that are not deleted
        const totalApplication = await Applicant.find().count()
    

        // Active and inactive Applicant
        const activeClient = await Applicant.countDocuments({ isActive: "Active"});
        const inactiveClient = await Applicant.countDocuments({isActive: "InActive" });


        const topUniversities = await Applicant.aggregate([
            { $match: { isActive: "Active" } }, // Match documents that are not deleted
            { $group: { _id: "$universityName", count: { $sum: 1 } } }, // Group by universityName and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order
            { $limit: 5 }, // Limit to top 5 universities
            { $project: { _id: 0, universityName: "$_id", count: 1 } } // Project the result with universityName and count
        ]);

        
        const topCountry = await Applicant.aggregate([
            { $match: { isActive: "Active" } }, // Match documents that are not deleted
            { $group: { _id: "$uniCountry", count: { $sum: 1 } } }, // Group by universityName and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order
            { $limit: 5 }, // Limit to top 3 universities
            { $project: { _id: 0, uniCountry: "$_id", count: 1 } } // Project the result with universityName and count
        ]);

        // Construct the response data
        const responseData = {
            totalApplication,
            activeClient,
            inactiveClient, 
            topUniversities,
            topCountry
        };
        response(req, res, activity, 'Level-1', 'GetAll-Application Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Application Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};