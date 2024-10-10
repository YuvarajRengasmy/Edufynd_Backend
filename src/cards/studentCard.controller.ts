import { Student, StudentDocument } from '../model/student.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as mongoose from 'mongoose';


var activity = "Student";

export let getAllStudentCardDetails = async (req, res, next) => {
    try {
        mongoose.set('debug', false);
        // Find all client that are not deleted
        const student = await Student.find()
        const totalStudent = student.length;

        // Number of unique countries
        const uniqueCountries = await Student.distinct("country");
        const totalUniqueCountries = uniqueCountries.length;

        // Active and inactive 
        const activeData = await Student.countDocuments({ isActive: "Active"});
        const inactiveData = await Student.countDocuments({ isActive: "InActive"});


       // Source-wise count of student
       const sourceCounts = await Student.aggregate([
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
        response(req, res, activity, 'Level-1', 'GetAll-Student Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Student Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};