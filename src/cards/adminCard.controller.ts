import { Admin, AdminDocument } from '../model/admin.model'
import { validationResult } from "express-validator";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as mongoose from 'mongoose';


var activity = "Admin";


export let getAllAdminCardDetails = async (req, res, next) => {
    try {
        mongoose.set('debug', false);
 
        const admin = await Admin.find()
        const totalAdmin = admin.length;

        // Number of unique countries
        const uniqueCountries = await Admin.distinct("country");
        const totalUniqueCountries = uniqueCountries.length;

        // Active and inactive 
        const activeData = await Admin.countDocuments({ isActive: "Active"});
        const inactiveData = await Admin.countDocuments({ isActive: "InActive"});


       // Source-wise count of student
       const sourceCounts = await Admin.aggregate([
        {
            $group: {
                _id: "$source",             // Group by country
                count: { $sum: 1 }           // Count the number of occurrences
            }
        },
        {
            $project: {
                source: "$_id",            // Rename _id to country
                count: 1,                   // Include count in the result
                _id: 0                      // Exclude _id from the result
            }
        }
    ]);

    // Create a country count object
    const sourceCountObj = {};
    sourceCounts.forEach(({ source, count }) => {
        sourceCountObj[source] = count;  
    });

        mongoose.set('debug', true);

        // Construct the response data
        const responseData = {
            totalAdmin,
            totalUniqueCountries,
            activeData,
            inactiveData,
            sourceCounts: sourceCountObj,  
        };
        response(req, res, activity, 'Level-1', 'GetAll-Admin Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Admin Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};