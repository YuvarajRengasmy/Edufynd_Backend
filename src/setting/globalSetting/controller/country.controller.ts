import { Country, CountryDocument } from '../../globalSetting/model/country.model'
import { Logs } from "../../../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Global-Country";



export const getAllCountry = async (req: any, res:any, next:any) => {
    try {
        const data = await Country.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Country', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Country', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCountry = async (req: any, res:any, next:any) => {
    try {
        const data = await Country.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Country', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Country', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

export let getAllLoggedCountry = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Country" })
        response(req, res, activity, 'Level-1', 'All-Logged Country', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedCountry = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged Country', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged Country', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


export let createCountry = async (req: any, res:any, next:any) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const country = await Country.findOne({ country: req.body.country })
            if(!country ){
            const countryDetails: CountryDocument = req.body;
            const createData = new Country(countryDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Country', true, 200, insertData, clientError.success.savedSuccessfully);
        }else {
            response(req, res, activity, 'Level-2', 'Create-Country', true, 422, {}, 'Already Registered Country');
        }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Country', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Country', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateCountry = async (req: any, res:any, next:any) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const countryDetails: CountryDocument = req.body;
            let statusData = await Country.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    country: countryDetails.country,
                    modifiedOn: new Date(),
                    modifiedBy:  countryDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Country Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Country Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Country Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteCountry = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const country = await Country.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Country', true, 200, country, 'Successfully Remove Country');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Country', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let getFilteredCountry = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.country) {
            andList.push({ country: req.body.country })
        }
      
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const countryList = await Country.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const countryCount = await Country.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterCountry', true, 200, { countryList, countryCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterCountry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
