import { University, UniversityDocument } from '../model/university.model'
import * as mongoose from 'mongoose'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "University";


export let getAllUniversit = async (req, res, next) => {
    try {

        mongoose.set('debug', false);
        // Find all universities that are not deleted
        const universities = await University.find()

        // Total number of universities
        const totalUniversities = universities.length;

        // Number of unique countries
        const uniqueCountries = await University.distinct("country");
        const totalUniqueCountries = uniqueCountries.length;

        // Active and inactive universities
        const activeUniversities = await University.countDocuments({ isActive: "Active" });
        const inactiveUniversities = await University.countDocuments({ isActive: "InActive" });

        // Popular categories count for each university
        const universitiesWithPopularCategories = universities.map(university => {
            return {
                universityName: university.universityName,
                popularCategoryCount: university.popularCategories.length
            };
        });

        // Get unique popular categories across all universities
        const uniquePopularCategories = [...new Set(
            universities.flatMap(university => university.popularCategories)
        )];

        const totalPopularCategoryCount = uniquePopularCategories.length;

        // Country-wise count of universities
        const countryCounts = await University.aggregate([
            {
                $group: {
                    _id: "$country",             // Group by country
                    count: { $sum: 1 }           // Count the number of occurrences
                }
            },
            {
                $project: {
                    country: "$_id",            // Rename _id to country
                    count: 1,                   // Include count in the result
                    _id: 0                      // Exclude _id from the result
                }
            }
        ]);

        // Create a country count object
        const countryCountObj = {};
        countryCounts.forEach(({ country, count }) => {
            countryCountObj[country] = count;  // Populate the country count object
        });


      

        const topCategory = await University.aggregate([
            { $match: { isActive: "Active" } }, // Match active universities
            { $unwind: "$popularCategories" }, // Unwind the popularCategories array to process each category separately
            { $group: { _id: "$popularCategories", count: { $sum: 1 } } }, // Group by category and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order (highest count first)
            { $group: { _id: null, uniqueCategories: { $push: { popularCategory: "$_id", count: "$count" } } } }, // Group into a single array of unique categories
            { $project: { _id: 0, uniqueCategories: { $slice: ["$uniqueCategories", 5] } } } // Limit to the top 5 categories
        ]);

        mongoose.set('debug', true);
        // Construct the response data
        const responseData = {
            totalUniversities,
            totalUniqueCountries,
            activeUniversities,
            inactiveUniversities,
            universitiesWithPopularCategories,
            totalPopularCategoryCount,
            countryCounts: countryCountObj,
            topCategory
        };

        // Send the response
        response(req, res, activity, 'Level-1', 'GetAll-University Card', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-University Card', false, 500, {}, errorMessage.internalServer, err.message);
    }
};