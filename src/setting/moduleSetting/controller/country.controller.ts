import { Country, CountryDocument } from '../model/country.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-CountryList";



export const getAllCountry = async (req, res) => {
    try {
        const data = await Country.find()
        response(req, res, activity, 'Level-1', 'GetAll-Country', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Country', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCountry = async (req, res) => {
    try {
        const data = await Country.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Country', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Country', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCountry = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: CountryDocument = req.body;
            const createData = new Country(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Country', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Country', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Country', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateCountry = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const countryDetails: CountryDocument = req.body;
            let statusData = await Country.findByIdAndUpdate({ _id: req.query._id }, {
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
            const country = await Country.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Country', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Country', false, 500, {}, errorMessage.internalServer, err.message);
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

            const dropDownList = await Country.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

            const dropDownCount = await Country.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Country', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Country', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };