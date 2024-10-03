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
        const accommodation = await Student.countDocuments({ typeOfClient: "Accommodation"});
        const flight = await Student.countDocuments({ typeOfClient: "Flight"});
        const forex = await Student.countDocuments({ typeOfClient: "Forex"});
        const education = await Student.countDocuments({ typeOfClient: "Educational Institute"});
        const finance = await Student.countDocuments({ typeOfClient: "Financial Institute"});

        mongoose.set('debug', true);

        // Construct the response data
        const responseData = {
            totalStudent,
            totalUniqueCountries,
            activeData,
            inactiveData,
            accommodation,
            flight,
            forex,
            education,
            finance
         
        };

        // Send the response
        response(req, res, activity, 'Level-1', 'GetAll-Student Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Student Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};