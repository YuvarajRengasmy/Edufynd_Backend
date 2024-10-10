import { Staff, StaffDocument } from '../model/staff.model'
import { validationResult } from 'express-validator'
import { response, transporter } from '../helper/commonResponseHandler'
import { clientError, errorMessage } from '../helper/ErrorMessage'
import * as mongoose from 'mongoose';

var activity = "Staff"


export let getAllStaffCardDetails = async (req, res, next) => {
    try {
        mongoose.set('debug', false);
     
        const staff = await Staff.find()
        const totalStaff = staff.length;

        const uniqueCountries = await Staff.distinct("country");
        const totalUniqueCountries = uniqueCountries.length;

        const activeData = await Staff.countDocuments({ isActive: "Active"});
        const inactiveData = await Staff.countDocuments({ isActive: "InActive"});

       // Source-wise count of student
       const sourceCounts = await Staff.aggregate([
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

    const sourceCountObj = {};
    sourceCounts.forEach(({ source, count }) => {
        sourceCountObj[source] = count;  // Populate the country count object
    });

        mongoose.set('debug', true);

        // Construct the response data
        const responseData = {
            totalStaff,
            totalUniqueCountries,
            activeData,
            inactiveData,
            sourceCounts: sourceCountObj,  
        };

        // Send the response
        response(req, res, activity, 'Level-1', 'GetAll-Staff Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Staff Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};