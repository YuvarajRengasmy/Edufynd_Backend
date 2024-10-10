import { Program, ProgramDocument } from '../model/program.model'
import * as mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import { response } from '../helper/commonResponseHandler'
import { clientError, errorMessage } from '../helper/ErrorMessage'


var activity = "Program"


export let getAllProgramCard = async (req, res, next) => {
    try {
        mongoose.set('debug', false);
        const program = await Program.find()

        // Total number of program
        const totalProgram = program.length;

        // Number of unique countries
        const uniqueCountries = await Program.distinct("country", { isDeleted: false });
        const totalUniqueCountries = uniqueCountries.length;

        // Number of unique universityName
        const uniqueUniversityName = await Program.distinct("universityName", { isDeleted: false });
        const universityName = uniqueUniversityName.length;

        // Active and inactive universities
        const activeProgram = await Program.countDocuments({ isActive: "Active" });
        const inactiveProgram = await Program.countDocuments({ isActive: "InActive" });

    // Unique country-wise program titles (explicit typing for the object)
    const countryWisePrograms: { [key: string]: Set<string> } = {};

    program.forEach(prog => {
        if (!countryWisePrograms[prog.country]) {
            countryWisePrograms[prog.country] = new Set();
        }
        countryWisePrograms[prog.country].add(prog.programTitle);
    });

    // Convert sets to arrays and count unique program titles per country
    const countrywise = Object.entries(countryWisePrograms).map(([country, programTitlesSet]) => ({
        country,
        // programTitles: Array.from(programTitlesSet),  // Convert Set to Array
        programCount: programTitlesSet.size           // Get the size of the Set
    }));

        mongoose.set('debug', true);
        // Construct the response data
        const responseData = {
            totalProgram,
            totalUniqueCountries,
            universityName,
            activeProgram,
            inactiveProgram,
            countrywise,
          
        };

        response(req, res, activity, 'Level-1', 'GetAll-Program Count', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Program Count', false, 500, {}, errorMessage.internalServer, err.message);
    }
};