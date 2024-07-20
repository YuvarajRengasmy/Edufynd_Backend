import { CountryList, CountryDocument } from '../model/country.model'
import { Country} from '../../globalSetting/model/country.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-CountryList";



export const getAllCountry = async (req, res) => {
    try {
        const data = await CountryList.find()
        response(req, res, activity, 'Level-1', 'GetAll-CountryList', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-CountryList', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCountry = async (req, res) => {
    try {
        const data = await CountryList.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-CountryList', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-CountryList', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCountry = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: CountryDocument = req.body;
            const createData = new CountryList(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-CountryList', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-CountryList', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-CountryList', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateCountry = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const countryDetails: CountryDocument = req.body;
            let statusData = await CountryList.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    name: countryDetails.name,
                    code: countryDetails.code,
                    modifiedOn: new Date(),
                    modifiedBy:  countryDetails.modifiedBy,
                },
                $addToSet: {
                   state: countryDetails.state,
               }
            });

            response(req, res, activity, 'Level-2', 'Update-CountryList Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-CountryList Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-CountryList Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deleteCountry = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await CountryList.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the CountryList', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the CountryList', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredCountry = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.name) {
                andList.push({ name: req.body.name })
            }
            if (req.body.code) {
                andList.push({ code: req.body.code })
            }  
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await CountryList.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

            const dropDownCount = await CountryList.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter CountryList', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter CountryList', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export const getCountryByState = async (req, res) => {
        const { name } = req.query; // Extract country from query params
        try {
            // Query universities based on country
            const countryList = await CountryList.find({ name: name });
            response(req, res, activity, 'Level-2', 'Get-CountryList By State ', true, 200, countryList, clientError.success.fetchedSuccessfully)
        } catch (err) {
            console.error('Error fetching universities:', err);
            response(req, res, activity, 'Level-3', 'Get-CountryList By State ', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }



    // export const getCountryByStateAndCity = async (req, res) => {
    //     try {
    //         const result = req.query.countryName
    //         console.log("hh", result)
    //         const data = await Country.find({country: result})
    //         console.log("88", data)
    //         const list = await CountryList.find({name: data})
    //         console.log("zz", list)
    //         response(req, res, activity, 'Level-1', 'GetAll-CountryList', true, 200, list, clientError.success.fetchedSuccessfully)
    
    //     } catch (err: any) {
    //         response(req, res, activity, 'Level-1', 'GetAll-CountryList', false, 500, {}, errorMessage.internalServer, err.message)
    //     }
    // }

    // export const getCountryByStateAndCity = async (req, res) => {
    //     try {
    //         const { countryName} = req.query;
    
    //         console.log("Country name:", countryName);
    
    //         // Find the country in the Country collection
    //         const country = await Country.findOne({ country: countryName }).exec();
    
    //         if (!country) {
    //             return response(req, res, 'ActivityName', 'Level-1', 'Get-Country-By-State-And-City', false, 404, {}, 'Country not found');
    //         }
    
    //         console.log("Country data:", country);
    
    //         // Find the matching state and city in the CountryList collection
    //         const list = await CountryList.findOne({
    //             countryName: countryName,
    //             // 'state.StateName': stateName,
    //             // 'state.cities': cityName
    //         }, {
    //             countryName: 1,
    //             code: 1,
    //             'state.$': 1
    //         }).exec();
    
    //         if (!list) {
    //             return response(req, res, 'ActivityName', 'Level-1', 'Get-Country-By-State-And-City', false, 404, {}, 'State or city not found in the specified country');
    //         }
    
    //         console.log("Country list data:", list);
    
    //         // Format the response data
    //         const data = {
    //             countryName: list.countryName,
    //             code: list.code,
    //             state: list.state[0].StateName,
    //             cities: list.state[0].cities
    //         };
    
    //         // Send the response
    //         response(req, res, 'ActivityName', 'Level-1', 'Get-Country-By-State-And-City', true, 200, data, 'Data fetched successfully');
    
    //     } catch (err) {
    //         console.error(err);
    //         response(req, res, 'ActivityName', 'Level-1', 'Get-Country-By-State-And-City', false, 500, {}, 'Internal server error', err.message);
    //     }
    // };
    