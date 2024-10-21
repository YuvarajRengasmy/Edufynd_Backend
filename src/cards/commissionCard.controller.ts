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

        const data = await Commission.find()
        const totalData = data.length;

        // Number of unique countries
        const uniqueCountries = await Commission.distinct("country");
        const totalUniqueCountries = uniqueCountries.length;

        // Active and inactive for Commisssion
        const activeData = await Commission.countDocuments({ isActive: "Active" });
        const inactiveData = await Commission.countDocuments({ isActive: "InActive" });
        // Function to aggregate counts based on a given field
        const getCounts = async (field) => {
            const counts = await Commission.aggregate([
                {
                    // $group: {
                    //     _id: `$${field}`,
                    //     count: { $sum: 1 }
                    // }

                    $group: {
                        _id: {
                            $cond: {
                                if: { $or: [{ $eq: [`$${field}`, ""] }, { $eq: [`$${field}`, null] }] },
                                then: "Fixed",  // Replace empty or null values with 'Unknown'
                                else: `$${field}`
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

        // Get payment method and payment type counts each category
        const paymentMethodCountObj = await getCounts('paymentMethod');
        const paymentTypeCountObj = await getCounts('paymentType');
        const taxCountObj = await getCounts('tax');
        const commissionPaidCountObj = await getCounts('commissionPaidOn');
   
    
        mongoose.set('debug', true);

        const responseData = {
            totalData,
            totalUniqueCountries,
            activeData,
            inactiveData,
            paymentMethodCounts: paymentMethodCountObj,
            paymentTypeCounts: paymentTypeCountObj,
            taxCounts: taxCountObj,
            commissionCounts: commissionPaidCountObj,
        };

        response(req, res, activity, 'Level-1', 'GetAll-Commission Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Commission Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};