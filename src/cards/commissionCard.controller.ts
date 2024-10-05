import { Commission, CommissionDocument } from '../model/commission.model'
import { Logs } from "../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as mongoose from 'mongoose';


var activity = "Commission";



export let getAllCommissionCardDetails = async (req, res, next) => {
    try {
        mongoose.set('debug', false);
 
        const student = await Commission.find()
        const totalStudent = student.length;

        // Number of unique countries
        const uniqueCountries = await Commission.distinct("country");
        const totalUniqueCountries = uniqueCountries.length;

        // Active and inactive 
        const activeData = await Commission.countDocuments({ isActive: "Active"});
        const inactiveData = await Commission.countDocuments({ isActive: "InActive"});


       // Source-wise count of student
       const sourceCounts = await Commission.aggregate([
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
        sourceCountObj[source] = count;  // Populate the country count object
    });

        mongoose.set('debug', true);

        // Construct the response data
        const responseData = {
            totalStudent,
            totalUniqueCountries,
            activeData,
            inactiveData,
            sourceCounts: sourceCountObj,  
        };

        // Send the response
        response(req, res, activity, 'Level-1', 'GetAll-Commission Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Commission Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};