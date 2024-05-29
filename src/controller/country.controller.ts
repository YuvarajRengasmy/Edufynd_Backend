import { Country, CountryDocument } from '../model/country.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";

var activity = "Country";



export let getAllCountry = async (req, res, next) => {
    try {
        const data = await Country.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Country', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleCountry = async (req, res, next) => {
    try {
        const country = await Country.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Country', true, 200, country, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



export let saveCountry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const countryDetails: CountryDocument = req.body;
            const createData = new Country(countryDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-Country', true, 200, insertData , clientError.success.savedSuccessfully);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Country', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Country', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateCountry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const countryDetails : CountryDocument = req.body;
            const updateData = await Country.findOneAndUpdate({ _id: req.body._id }, {
                $set: {  
                    country: countryDetails.country
                }
                
            });
            response(req, res, activity, 'Level-2', 'Update-Country', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Country', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Country', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteCountry = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const country = await Country.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Delete-Country', true, 200, country, 'Successfully Remove Country');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
