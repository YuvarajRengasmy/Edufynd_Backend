import { Forex, ForexDocument } from '../enquiries/model/forex.model'
import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, transporter } from "../helper/commonResponseHandler";
import * as mongoose from 'mongoose';


var activity = "ForexEnquiry";


export let getAllForexEnquiryCard = async (req, res, next) => {
    try {
        mongoose.set('debug', false);

        const data = await Forex.find()
        const totalData = data.length;

        // Number of unique countries
        const uniqueCountries = await Forex.distinct("country");
        const totalUniqueCountries = uniqueCountries.length;

        // Active and inactive 
        const activeData = await Forex.countDocuments({ isActive: "Active" });
        const inactiveData = await Forex.countDocuments({ isActive: "InActive" });
        // Function to aggregate counts based on a given field
        const getCounts = async (field) => {
            const counts = await Forex.aggregate([
                {
               
                    $group: {
                        _id: {
                            $cond: {
                                if: { 
                                    $or: [
                                        { $eq: [{ $ifNull: [`$${field}`, null] }, null] }, // Check if field is missing or null
                                        { $eq: [`$${field}`, ""] } // Check if field is an empty string
                                    ]
                                },
                                then: "Others",  // Group as 'Others' if field is missing, null, or empty
                                else: `$${field}`  // Otherwise, group by the actual source value
                            }
                        },
                        count: { $sum: 1 }  
                    }
                    
                },
                {
                    $project: {
                        source: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
        
            ]);

            const countObj = {};
            counts.forEach(({ source, count }) => {
                countObj[source] = count;
            });

            return countObj;
        };

        // Get payment method and payment type counts
        const sourceCountObj = await getCounts('source');
    
        mongoose.set('debug', true);

        // Construct the response data
        const responseData = {
            totalData,
            activeData,
            inactiveData,
            sourceCounts: sourceCountObj,
          
        };

        // Send the response
        response(req, res, activity, 'Level-1', 'GetAll-Forex Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Forex Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};