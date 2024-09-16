import { University, UniversityDocument } from '../model/university.model'
import * as mongoose from 'mongoose'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import csv = require('csvtojson')
import xlsx = require('xlsx')


var activity = "University";

export let getAllUniversity = async (req, res, next) => {
    try {
        const data = await University.find({ isDeleted: false }).sort({ universityCode: -1 });
        response(req, res, activity, 'Level-1', 'GetAll-University', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-University', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleUniversity = async (req, res, next) => {
    try {
        const student = await University.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-University', true, 200, student, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-University', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



const generateNextUniversityCode = async (currentMaxCounter): Promise<string> => {
    const newCounter = currentMaxCounter + 1;
    const formattedCounter = String(newCounter).padStart(3, '0');
    return `UN_${formattedCounter}`;
};


export let saveUniversity = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const university = await University.findOne({ universityName: req.body.universityName });
            if (!university) {
                const universityDetails: UniversityDocument = req.body;
                universityDetails.createdOn = new Date()
                const univesity = await University.find({}, 'universityCode').exec();
                const maxCounter = univesity.reduce((max, app) => {
                    const appCode = app.universityCode;
                    const parts = appCode.split('_')
                    if (parts.length === 2) {
                        const counter = parseInt(parts[1], 10)
                        return counter > max ? counter : max;
                    }
                    return max;
                }, 100);

                let currentMaxCounter = maxCounter;
                universityDetails.universityCode = await generateNextUniversityCode(currentMaxCounter)
                const createData = new University(universityDetails);
                let insertData = await createData.save();

                response(req, res, activity, 'Level-1', 'Save-University', true, 200, insertData, clientError.success.savedSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-2', 'Save-University', true, 422, {}, 'University Name already registered');
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Save-University', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-University', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateUniversity = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const universityDetails: UniversityDocument = req.body;
            let universityData = await University.findByIdAndUpdate({ _id: universityDetails._id }, {
                $set: {
                    universityName: universityDetails.universityName,
                    businessName: universityDetails.businessName,
                    banner: universityDetails.banner,
                    universityLogo: universityDetails.universityLogo,
                    countryName: universityDetails.countryName,
                    about: universityDetails.about,
                    courseType: universityDetails.courseType,
                    email: universityDetails.email,
                    country: universityDetails.country,
                    flag: universityDetails.flag,
                    ranking: universityDetails.ranking,
                    averageFees: universityDetails.averageFees,
                    popularCategories: universityDetails.popularCategories,
                    admissionRequirement: universityDetails.admissionRequirement,
                    offerTAT: universityDetails.offerTAT,
                    founded: universityDetails.founded,
                    institutionType: universityDetails.institutionType,
                    paymentMethod: universityDetails.paymentMethod,
                    amount: universityDetails.amount,
                    percentage: universityDetails.percentage,
                    eligibilityForCommission: universityDetails.eligibilityForCommission,
                    currency: universityDetails.currency,
                    paymentTAT: universityDetails.paymentTAT,
                    tax: universityDetails.tax,
                    commissionPaidOn: universityDetails.commissionPaidOn,
                    courseFeesPercentage: universityDetails.courseFeesPercentage,
                    paidFeesPercentage: universityDetails.paidFeesPercentage,
                    website: universityDetails.website,
                    inTake: universityDetails.inTake,

                    modifiedOn: new Date(),
                    modifiedBy: universityDetails.modifiedBy,

                },
                $addToSet: {
                    campuses: universityDetails.campuses,

                }
            });

            response(req, res, activity, 'Level-2', 'Update-University', true, 200, universityData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-University', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-University', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let deleteUniversity = async (req, res, next) => {

    try {
        const university = await University.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-2', 'Delete-University', true, 200, university, 'Successfully Remove University');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-University', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Balan K K
 * @date   16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get All University For Web
 */

export let getAllUniversityForWeb = async (req, res, next) => {
    try {
        const universityDetails = await University.find({ isDeleted: false }).sort({ createdAt: -1 });
        response(req, res, activity, 'Level-2', 'Get-All-University for web', true, 200, universityDetails, clientError.success.fetchedSuccessfully);
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-All-University for web', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Balan K K
 * @date 16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter University Details
 */

export let getFilteredUniversity = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.businessName) {
            andList.push({ businessName: req.body.businessName })
        }
        if (req.body.country) {
            andList.push({ country: req.body.country })
        }
        if (req.body.campuses) {
            andList.push({ campus: req.body.campuses })
        }
        if (req.body.ranking) {
            andList.push({ ranking: req.body.ranking })
        }
        if (req.body.popularCategories) {
            andList.push({ popularCategories: req.body.popularCategories })
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const universityList = await University.find(findQuery).sort({ universityCode: -1 }).limit(limit).skip(page)

        const universityCount = await University.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterUniversity', true, 200, { universityList, universityCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUniversity', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



/**
 * @author Balan K K
 * @date 16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter University Details for Agent
 */

export let getFilteredUniversityForAgent = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.agentId) {
            andList.push({ agentId: req.body.agentId })
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.businessName) {
            andList.push({ businessName: req.body.businessName })
        }
        if (req.body.country) {
            andList.push({ country: req.body.country })
        }
        if (req.body.campus) {
            andList.push({ campus: req.body.campus })
        }
        if (req.body.ranking) {
            andList.push({ ranking: req.body.ranking })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const universityList = await University.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('agentId', { name: 1, email: 1, mobileNumber: 1 })    //.populate('companyId',{companyName:1});

        const universityCount = await University.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterUniversity-Agent', true, 200, { universityList, universityCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUniversity-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



/**
 * @author Balan K K
 * @date 15-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter University Details for Student
 */

export let getFilteredUniversityForStudent = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId })
        }
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.clientName) {
            andList.push({ clientName: req.body.clientName })
        }
        if (req.body.country) {
            andList.push({ country: req.body.country })
        }
        if (req.body.ranking) {
            andList.push({ ranking: req.body.ranking })
        }
        if (req.body.courseType) {
            andList.push({ courseType: req.body.courseType })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const universityList = await University.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 })    //.populate('companyId',{companyName:1});

        const universityCount = await University.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterUniversity-Agent', true, 200, { universityList, universityCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUniversity-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



/**
 * @author Balan K K
 * @date 16-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used CSV file to JSON and Store to Database
 */


export const csvToJsonc = async (req, res) => {
    try {
        const csvData = await csv().fromFile(req.file.path);
        const univesity = await University.find({}, 'universityCode').exec();
        const maxCounter = univesity.reduce((max, app) => {
            const appCode = app.universityCode;
            const parts = appCode.split('_')
            if (parts.length === 2) {
                const counter = parseInt(parts[1], 10);
                return counter > max ? counter : max;
            }
            return max;
        }, 100);

        let currentMaxCounter = maxCounter;

        const universityList = [];
        for (const data of csvData) {
            // Parse the State and City fields as arrays from strings like "[TamilNadu],[Karnataka]"
            const states = data.State ? data.State.match(/\[([^\]]+)\]/g).map(s => s.replace(/[\[\]]/g, '').trim()) : [];
            const cityGroups = data.City ? data.City.match(/\[([^\]]+)\]/g).map(c => c.replace(/[\[\]]/g, '').split(',').map(city => city.trim())) : [];

            // Create campuses by mapping states to corresponding city groups
            const campuses = states.flatMap((state, index) => {
                const correspondingCities = cityGroups[index] || [];
                return correspondingCities.map(city => ({
                    state: state,  // No need to trim again since it's already done
                    lga: city,  // Corresponding city
                    _id: new mongoose.Types.ObjectId()  // Generate a new ObjectId for _id
                }));
            });

            // Generate university code and create university data object
            const universityCode = await generateNextUniversityCode(currentMaxCounter);
            currentMaxCounter++;

            universityList.push({
                universityCode: universityCode,
                universityName: data.UniversityName,
                universityLogo: data.UniversityLogo,
                courseType: data.CourseType ? data.CourseType.split(',') : [],
                businessName: data.ClientName,
                banner: data.Banner,
                country: data.Country,
                campuses: campuses,
                countryName: data.CountryName,
                email: data.Email,
                ranking: data.Ranking,
                applicationFees: data.ApplicationFees,
                averageFees: data.AverageFees,
                popularCategories: data.PopularCategories ? data.PopularCategories.split(',') : [],
                offerTAT: data.OfferTAT,
                founded: data.Founded,
                institutionType: data.InstitutionType,
                costOfLiving: data.CostOfLiving,
                admissionRequirement: data.AdmissionRequirement,
                grossTuition: data.GrossTuition,
                flag: data.Flag,
                paymentMethod: data.PaymentMethod,
                amount: data.Amount,
                percentage: data.Percentage,
                eligibilityForCommission: data.EligibilityForCommission,
                currency: data.Currency,
                paymentTAT: data.PaymentTAT,
                tax: data.Tax,
                inTake: data.InTake ? data.InTake.split(',') : [],
                website: data.Website,
                commissionPaidOn: data.CommissionPaidOn,
                about: data.About,
                typeOfClient: data.TypeOfClient
            });
        }

        await University.insertMany(universityList);
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database', true, 200, { universityList }, 'Successfully CSV File Stored Into Database');
    } catch (err) {
        console.error(err);
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database', false, 500, {}, 'Internal Server Error', err.message);
    }
};




export const getUniversityWithProgramDetails = async (req, res) => {
    try {
        const mongoose = require('mongoose')
        const universityId = new mongoose.Types.ObjectId(req.query.universityId);
        if (!universityId) {
            return res.status(400).json({ success: false, message: 'University ID is required' });
        }

        const aggregationPipeline = [
            {
                $match: { _id: universityId }
            },
            {
                $lookup: {
                    from: 'programs',
                    localField: '_id',
                    foreignField: 'universityId',
                    as: 'programDetails'
                }
            },

            {
                $project: {
                    _id: 1,
                    universityName: 1,
                    universityLogo: 1,
                    country: 1,
                    programDetails: {
                        programTitle: 1,
                        courseType: 1,
                        inTake: 1,
                        courseFee: 1,
                        campus: 1,
                    }
                }
            },

        ];

        const result = await University.aggregate(aggregationPipeline);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }
        const university = result[0];

        const response = {
            success: true,
            data: {
                universityDetails: {
                    universityId: university._id.toString(),
                    universityName: university.universityName,
                    universityLogo: university.universityLogo,
                    country: university.country,
                    campus: university.campus,
                    programDetails: university.programDetails.map(program => ({
                        programTitle: program.programTitle,
                        courseType: program.courseType,
                        inTake: program.inTake,
                        courseFee: program.courseFee,
                        campus: program.campus
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


export const getUniversityByCountry = async (req, res) => {
    const { country } = req.query;
    try {
        const universities = await University.find({ country: country });
        response(req, res, activity, 'Level-2', 'Get-University By Country', true, 200, universities, clientError.success.fetchedSuccessfully)
    } catch (err) {
        console.error('Error fetching universities:', err);
        response(req, res, activity, 'Level-3', 'Get-University By Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export const getUniversityByName = async (req, res) => {
    try {
        const { name } = req.params;
        const university = await University.findOne({ universityName: name });
        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }
        res.json({ result: university });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


////


export const csvToJsonf = async (req, res) => {
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

        const university = await University.find({}, 'universityCode').exec();
        const maxCounter = university.reduce((max, app) => {
            const appCode = app.universityCode;
            const parts = appCode.split('_');
            if (parts.length === 2) {
                const counter = parseInt(parts[1], 10);
                return counter > max ? counter : max;
            }
            return max;
        }, 100);

        let currentMaxCounter = maxCounter;
        const universityList = [];

        for (const data of fileData) {
            // Parse State and City fields as arrays
            const states = data.State ? data.State.match(/\[([^\]]+)\]/g).map(s => s.replace(/[\[\]]/g, '').trim()) : [];
            const cityGroups = data.City ? data.City.match(/\[([^\]]+)\]/g).map(c => c.replace(/[\[\]]/g, '').split(',').map(city => city.trim())) : [];

            // Create campuses by mapping states to corresponding city groups
            const campuses = states.flatMap((state, index) => {
                const correspondingCities = cityGroups[index] || [];
                return correspondingCities.map(city => ({
                    state: state,
                    lga: city,
                    _id: new mongoose.Types.ObjectId()  // Generate a new ObjectId for _id
                }));
            });

            // Generate university code and create university data object
            const universityCode = await generateNextUniversityCode(currentMaxCounter);
            currentMaxCounter++;

            universityList.push({
                universityCode: universityCode,
                universityName: data.UniversityName,
                universityLogo: data.UniversityLogo,
                courseType: data.CourseType ? data.CourseType.split(',') : [],
                businessName: data.ClientName,
                banner: data.Banner,
                country: data.Country,
                campuses: campuses,
                countryName: data.CountryName,
                email: data.Email,
                ranking: data.Ranking,
                applicationFees: data.ApplicationFees,
                averageFees: data.AverageFees,
                popularCategories: data.PopularCategories ? data.PopularCategories.split(',') : [],
                offerTAT: data.OfferTAT,
                founded: data.Founded,
                institutionType: data.InstitutionType,
                costOfLiving: data.CostOfLiving,
                admissionRequirement: data.AdmissionRequirement,
                grossTuition: data.GrossTuition,
                flag: data.Flag,
                paymentMethod: data.PaymentMethod,
                amount: data.Amount,
                percentage: data.Percentage,
                eligibilityForCommission: data.EligibilityForCommission,
                currency: data.Currency,
                paymentTAT: data.PaymentTAT,
                tax: data.Tax,
                inTake: data.InTake ? data.InTake.split(',') : [],
                website: data.Website,
                commissionPaidOn: data.CommissionPaidOn,
                about: data.About,
                typeOfClient: data.ClientName,
                primary: data.PrimaryCampus
            });
        }

        await University.insertMany(universityList);
        response(req, res, activity, 'Level-1', 'File-Insert-Database', true, 200, { universityList }, 'Successfully File Stored Into Database');
    } catch (err) {
        console.error(err);
        response(req, res, activity, 'Level-3', 'File-Insert-Database', false, 500, {}, 'Internal Server Error', err.message);
    }
};


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

        const university = await University.find({}, 'universityCode').exec();
        const maxCounter = university.reduce((max, app) => {
            const appCode = app.universityCode;
            const parts = appCode.split('_');
            if (parts.length === 2) {
                const counter = parseInt(parts[1], 10);
                return counter > max ? counter : max;
            }
            return max;
        }, 100);

        let currentMaxCounter = maxCounter;
        const universityList = [];

        for (const data of fileData) {
            // Parse State and City fields as arrays
            const states = data.State ? data.State.match(/\[([^\]]+)\]/g).map(s => s.replace(/[\[\]]/g, '').trim()) : [];
            const cityGroups = data.City ? data.City.match(/\[([^\]]+)\]/g).map(c => c.replace(/[\[\]]/g, '').split(',').map(city => city.trim())) : [];

        
            const primaryCampus = data.PrimaryCampus ? data.PrimaryCampus.trim() : '';

            // Create campuses by mapping states to corresponding city groups
            const campuses = states.flatMap((state, index) => {
                const correspondingCities = cityGroups[index] || [];

                return correspondingCities.map(city => ({
                    state: state,
                    lga: city,
                    primary: state === primaryCampus ? "Primary Campus" : "Secondary Campus",
                    _id: new mongoose.Types.ObjectId()  // Generate a new ObjectId for _id
                }));
            });

            // Generate university code and create university data object
            const universityCode = await generateNextUniversityCode(currentMaxCounter);
            currentMaxCounter++;

            universityList.push({
                universityCode: universityCode,
                universityName: data.UniversityName,
                universityLogo: data.UniversityLogo,
                courseType: data.CourseType ? data.CourseType.split(',') : [],
                businessName: data.ClientName,
                banner: data.Banner,
                country: data.Country,
                campuses: campuses,
                countryName: data.CountryName,
                email: data.Email,
                ranking: data.Ranking,
                applicationFees: data.ApplicationFees,
                averageFees: data.AverageFees,
                popularCategories: data.PopularCategories ? data.PopularCategories.split(',') : [],
                offerTAT: data.OfferTAT,
                founded: data.Founded,
                institutionType: data.InstitutionType,
                costOfLiving: data.CostOfLiving,
                admissionRequirement: data.AdmissionRequirement,
                grossTuition: data.GrossTuition,
                flag: data.Flag,
                paymentMethod: data.PaymentMethod,
                amount: data.Amount,
                percentage: data.Percentage,
                eligibilityForCommission: data.EligibilityForCommission,
                currency: data.Currency,
                paymentTAT: data.PaymentTAT,
                tax: data.Tax,
                inTake: data.InTake ? data.InTake.split(',') : [],
                website: data.Website,
                commissionPaidOn: data.CommissionPaidOn,
                about: data.About,
                typeOfClient: data.ClientName,
                primary: data.PrimaryCampus
            });
        }

        await University.insertMany(universityList);
        response(req, res, activity, 'Level-1', 'File-Insert-Database', true, 200, { universityList }, 'Successfully File Stored Into Database');
    } catch (err) {
        console.error(err);
        response(req, res, activity, 'Level-3', 'File-Insert-Database', false, 500, {}, 'Internal Server Error', err.message);
    }
};



