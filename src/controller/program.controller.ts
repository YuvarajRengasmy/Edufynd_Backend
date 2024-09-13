import { Program, ProgramDocument } from '../model/program.model'
import { University, UniversityDocument } from '../model/university.model'
import { validationResult } from 'express-validator'
import { response } from '../helper/commonResponseHandler'
import { clientError, errorMessage } from '../helper/ErrorMessage'
import csv = require('csvtojson')
import xlsx = require('xlsx')


var activity = "Program"


export const getAllProgram = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        const program = await Program.find({ isDeleted: false })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const programList = await Program.find(findQuery).sort({ programCode: -1 }).limit(limit).skip(page)
        const programCount = await Program.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'GetAll-Program', true, 200, { programList, programCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Program', false, 500, {}, errorMessage.internalServer, err.message)

    }
}




export const getSingleProgram = async (req, res, next) => {
    try {
        const program = await Program.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Program', true, 200, program, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetSingle-Program', false, 500, {}, errorMessage.internalServer, err.message)

    }
}


const generateNextProgramCode = async (currentMaxCounter): Promise<string> => {
    const newCounter = currentMaxCounter + 1;
    const formattedCounter = String(newCounter).padStart(3, '0');
    return `PG_${formattedCounter}`;
};


export let createProgram = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            // Check if a program with the same title already exists for the same university
            const existingProgram = await Program.findOne({ 
                universityName: req.body.universityName, 
                programTitle: req.body.programTitle
            });

            if (!existingProgram) {
                const programDetails: ProgramDocument = req.body;

                // Generate the next program code
                const programs = await Program.find({}, 'programCode').exec();
                const maxCounter = programs.reduce((max, app) => {
                    const appCode = app.programCode;
                    const parts = appCode.split('_');
                    if (parts.length === 2) {
                        const counter = parseInt(parts[1], 10);
                        return counter > max ? counter : max;
                    }
                    return max;
                }, 100); 

                // Generate the next program code based on the current max counter
                let currentMaxCounter = maxCounter;
                programDetails.programCode = await generateNextProgramCode(currentMaxCounter);

                // Calculate the final value based on application fee and discounted value

                const newProgram = new Program(programDetails);
                let insertedData = await newProgram.save();

                // Respond with success
                response(req, res, activity, 'Level-2', 'Create-Program', true, 200, insertedData, clientError.success.savedSuccessfully);
            } else {
                // Respond with error if program title is already registered for the same university
                response(req, res, activity, 'Level-3', 'Create-Program', true, 422, {}, 'Program Title Already Registered For Same University');
            }
        } catch (err: any) {
            console.log(err);
            response(req, res, activity, 'Level-3', 'Create-Program', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Program', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let updateProgram = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const programDetails: ProgramDocument = req.body;
            let updateData = await Program.findByIdAndUpdate({ _id: programDetails._id }, {
                $set: {
                    universityName: programDetails.universityName,
                    country: programDetails.country,
                    courseType: programDetails.courseType,
                    programTitle: programDetails.programTitle,
                    applicationFee: programDetails.applicationFee,
                    currency: programDetails.currency,
                    flag: programDetails.flag,
                 
                    campuses: programDetails.campuses,
                    popularCategories: programDetails.popularCategories,
                    englishlanguageTest: programDetails.englishlanguageTest,
                    universityInterview: programDetails.universityInterview,
                    greGmatRequirement: programDetails.greGmatRequirement,
                    academicRequirement: programDetails.academicRequirement,
                    commission: programDetails.commission,
                    modifiedOn: new Date(),
                    modifiedBy: programDetails.modifiedBy,
                },

            })
            response(req, res, activity, 'Level-2', 'Update-Program', true, 200, updateData, clientError.success.updateSuccess);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Program', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Program', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteProgram = async (req, res, next) => {
    try {
        const program = await Program.findOneAndDelete({ _id: req.query._id })
        response(req, res, activity, 'Level-2', 'Delete-Program', true, 200, program, 'Successfully Remove Program');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Program', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
/**
 * @author Balan K K
 * @date   17-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All Program For Web
 */


export let getAllProgramForWeb = async (req, res, next) => {
    try {
        const programDetails = await Program.find({ isDeleted: false }).sort({ programCode: -1});
        response(req, res, activity, 'Level-2', 'Get-All-Program for web', true, 200, programDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-Program for web', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Balan K K
 * @date 15-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter Program Details
 */

export let getFilteredProgram = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.country) {
            andList.push({ country: req.body.country })
        }
        if (req.body.campus) {
            andList.push({ campus: req.body.campus })
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType })
        }
        if (req.body.programTitle) {
            andList.push({ programTitle: req.body.programTitle })
        }
        if (req.body.universityInterview) {
            andList.push({ universityInterview: req.body.universityInterview })
        }
        if (req.body.englishlanguageTest) {
            andList.push({ englishlanguageTest: req.body.englishlanguageTest })
        }
        if (req.body.courseFee) {
            andList.push({ courseFee: req.body.courseFee })
        }
        if (req.body.inTake) {
            andList.push({ inTake: req.body.inTake })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const programList = await Program.find(findQuery).sort({ programCode: -1 }).limit(limit).skip(page)
        const programCount = await Program.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterProgram', true, 200, { programList, programCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterProgram', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Balan K K
 * @date 15-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter Program Details for Applied student
 */

export let getFilteredProgramForAppliedStudent = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.appliedStudentId) {
            andList.push({ appliedStudentId: req.body.appliedStudentId })
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.programTitle) {
            andList.push({ programTitle: req.body.programTitle })
        }
        if (req.body.country) {
            andList.push({ country: req.body.country })
        }
        if (req.body.campus) {
            andList.push({ campus: req.body.campus })
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const programList = await Program.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 }).populate('universityName');

        const programCount = await Program.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterProgram For Applied-Student', true, 200, { programList, programCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterProgram For Applied-Student', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



/**
 * @author Balan K K
 * @date 20-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used CSV file to JSON and Store to Database
 */


export const csvToJson = async (req, res) => {
    try {
        let fileData = [];

        // Check file extension
        const fileExtension = req.file.originalname.split('.').pop();

        if (fileExtension === 'csv') {
            // Parse CSV file
            fileData = await csv().fromFile(req.file.path);
        } else if (fileExtension === 'xlsx') {
            // Parse XLSX file
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
            const worksheet = workbook.Sheets[sheetName];
            fileData = xlsx.utils.sheet_to_json(worksheet, { raw: true });
        } else {
            return res.status(400).json({ message: 'Unsupported file format. Please upload CSV or XLSX.' });
        }

        const program = await Program.find({}, 'programCode').exec();
        const maxCounter = program.reduce((max, app) => {
            const programCode = app.programCode;
            const counter = parseInt(programCode.split('_')[1], 10);
            return counter > max ? counter : max;
        }, 100);

        let currentMaxCounter = maxCounter;
        let programList = [];

        for (const data of fileData) {
            const programCode = await generateNextProgramCode(currentMaxCounter);
            currentMaxCounter++;

            // Parse campuses information
            const campuses = [];
            const campusNames = data.Campus ? data.Campus.match(/\[([^\]]+)\]/g).map(c => c.replace(/[\[\]]/g, '').trim()) : [];
            const inTakeData = data.InTake ? data.InTake.match(/\[([^\]]+)\]/g).map(i => i.replace(/[\[\]]/g, '').trim()) : [];
            const durationData = data.Duration ? data.Duration.match(/\[([^\]]+)\]/g).map(d => d.replace(/[\[\]]/g, '').trim()) : [];
            const courseFeesData = data.CourseFee ? data.CourseFee.match(/\[([^\]]+)\]/g).map(f => f.replace(/[\[\]]/g, '').trim()) : [];

            // Map campuses with intake, duration, and course fees
            campusNames.forEach((campusName, index) => {
                campuses.push({
                    campus: campusName,
                    inTake: inTakeData[index] || '',
                    duration: durationData[index] || '',
                    courseFees: courseFeesData[index] || ''
                });
            });

            // Add the program data
            programList.push({
                programCode: programCode,
                universityName: data.UniversityName,
                campuses: campuses,
                applicationFee: data.ApplicationFee,
                country: data.Country,
                courseType: data.CourseType,
                programTitle: data.ProgramTitle,
                currency: data.Currency,
                flag: data.Flag,
                discountedValue: data.DiscountedValue,
                courseFee: data.CourseFee,
                inTake: data.InTake ? data.InTake.split(',') : [],
                duration: data.Duration,
                englishlanguageTest: data.EnglishlanguageTest,
                textBox: data.TextBox,
                universityInterview: data.UniversityInterview,
                greGmatRequirement: data.GreGmatRequirement,
                score: data.Score,
                academicRequirement: data.AcademicRequirement,
                commission: data.Commission,
            });
        }

        // Insert into the database
        await Program.insertMany(programList);
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database', true, 200, { programList }, 'Successfully CSV File Stored Into Database');
    } catch (err) {
        console.error(err);
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database', false, 500, {}, 'Internal Server Error', err.message);
    }
};


/**
 * @author Balan K K
 * @date 23-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to filter the particular university details with that program detail
 */



export const getProgramsByUniversityName = async (req, res) => {
    try {
        const universityId = req.query.universityId;

        if (!universityId) {
            return res.status(400).json({ success: false, message: 'University ID is required' });
        }
        const university = await University.findById(universityId).lean();
        if (!university) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }
        const programs = await Program.find({ universityId: university._id })
            .select('programTitle courseType inTake courseFee campus')
            .lean();

        const response = {
            success: true,
            data: {
                universityDetails: {
                    universityId: university._id,
                    universityName: university.universityName,
                    universityLogo: university.universityLogo,
                    country: university.country,
                    programDetails: programs.map(program => ({
                    programTitle: program.programTitle,
                    campuses: program.campuses,
                    }))
                }
            }
        };

        res.status(200).json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



export const getProgramDetailsByUniversity = async (req, res, next) => {
    try {
        const { limit, page, universityId } = req.body;

        const findQuery = {isDeleted: false,universityId: universityId};

        const programList = await Program.find(findQuery)
            .sort({ programCode: -1 }).limit(limit).skip(page).populate('universityId', { universityName: 1 });

        const programCount = await Program.countDocuments(findQuery);

        response(req, res, activity, 'Level-1', 'GetUniversityProgram', true, 200, { programList, programCount }, clientError.success.fetchedSuccessfully);
    } catch (err) {
        response(req, res, activity, 'Level-3', 'GetUniversityProgram', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export const updateProgramApplications = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const { programId, studentId } = req.body;

            // Check if the student is already applied
            const program = await Program.findOne({ _id: programId, appliedStudentId: studentId });

            if (program) {
                // Student already applied, remove the student
                const updatedProgram = await Program.findByIdAndUpdate(
                    programId,
                    {
                        $pull: { appliedStudentId: studentId }
                    },
                    { new: true }
                );

                response(req, res, activity, 'Level-2', 'Update-Program-Applications', true, 200, updatedProgram, 'Student application removed successfully');
            } else {
                // Student not applied, add the student
                const updatedProgram = await Program.findByIdAndUpdate(
                    programId,
                    {
                        $addToSet: { appliedStudentId: studentId }
                    },
                    { new: true }
                );

                response(req, res, activity, 'Level-1', 'Update-Program-Applications', true, 200, updatedProgram, 'Student applied successfully');
            }
        } catch (err) {
            response(req, res, activity, 'Level-2', 'Update-Program-Applications', false, 500, {}, 'Internal server error', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Program-Applications', false, 422, {}, 'Field validation error', JSON.stringify(errors.mapped()));
    }
};


export const getProgramUniversity = async (req, res) => {
    try {
        
        const data = await Program.find({universityId:req.query.universityId})
  
        response(req, res, activity, 'Level-1', 'GetSingle-Program', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Program', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getProgramCategory = async (req, res) => {
    try {
        
        const data = await Program.find({popularCategories:req.query.popularCategories})
  
        response(req, res, activity, 'Level-1', 'GetSingle-Program', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Program', false, 500, {}, errorMessage.internalServer, err.message)
    }
}




export const getProgramByCountry = async (req, res) => {
    const { country, inTake } = req.query; 
    try {
        const query = {country,inTake};
        if (country) query.country = country;
        if (inTake) query['campuses.inTake'] = inTake;

        const universities = await Program.find(query);
        response(req, res, activity, 'Level-2', 'Get-Program By Country and Intake', true, 200, universities, clientError.success.fetchedSuccessfully);
    } catch (err) {
        console.error('Error fetching universities:', err);
        response(req, res, activity, 'Level-3', 'Get-University By Country and Intake', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

export const  getProgramByUniversity = async (req, res) => {
    const {
        universityId} = req.query; 
    try {
        const universities = await University.find({  _id:  universityId });
        response(req, res, activity, 'Level-2', 'Get-University By Country', true, 200, universities, clientError.success.fetchedSuccessfully)
    } catch (err) {
        console.error('Error fetching universities:', err);
        response(req, res, activity, 'Level-3', 'Get-University By Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
}






export const csvToJsonn = async (req, res) => {
    try {

        let fileData = [];

        // Check file extension
        const fileExtension = req.file.originalname.split('.').pop();

        if (fileExtension === 'csv') {
            // Parse CSV file
            fileData = await csv().fromFile(req.file.path);
        } else if (fileExtension === 'xlsx') {
            // Parse XLSX file
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
            const worksheet = workbook.Sheets[sheetName];
            fileData = xlsx.utils.sheet_to_json(worksheet, { raw: true });
        } else {
            return res.status(400).json({ message: 'Unsupported file format. Please upload CSV or XLSX.' });
        }
        const program = await Program.find({}, 'programCode').exec();

        const maxCounter = program.reduce((max, app) => {
            const programCode = app.programCode;
            const counter = parseInt(programCode.split('_')[1], 10);
            return counter > max ? counter : max;
        }, 100);

        let currentMaxCounter = maxCounter;

        // Process CSV data
        let programList = [];
        for (const data of fileData) {
            const programCode = await generateNextProgramCode(currentMaxCounter);
            currentMaxCounter++;
            programList.push({
                programCode: programCode,
                universityName: data.UniversityName,
                campus: data.Campus ? data.Campus.split(',') : [],
                applicationFee: data.ApplicationFee,
                country: data.Country,
                courseType: data.CourseType,                   
                programTitle: data.ProgramTitle,
                currency: data.Currency,
                flag: data.Flag,
                discountedValue: data.DiscountedValue,
                courseFee: data.CourseFee,
                inTake: data.InTake ? data.InTake.split(',') : [],
                duration: data.Duration,
                englishlanguageTest: data.EnglishlanguageTest,
                textBox: data.TextBox,
                universityInterview: data.UniversityInterview,
                greGmatRequirement: data.GreGmatRequirement,
                score: data.Score,
                academicRequirement: data.AcademicRequirement,
                commission: data.Commission,
            });
        }
    
        await Program.insertMany(programList);
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database', true, 200, { programList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        console.error(err);
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database', false, 500, {}, 'Internal Server Error', err.message);
    }
};