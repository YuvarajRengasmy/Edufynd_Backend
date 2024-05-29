import { Country, CountryDocument } from '../../globalSetting/model/country.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Global-Country";



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
        response(req, res, activity, 'Level-1', 'GetSingle-Status', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Status', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: StatusDocument = req.body;
            const createData = new Status(statusDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Status', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Status', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Status', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateStatus = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const statusDetails: StatusDocument = req.body;
            let statusData = await Status.findByIdAndUpdate({ _id: statusDetails._id }, {
                $set: {
                    statusName: statusDetails.statusName,
                    duration: statusDetails.duration,
                    modifiedOn: statusDetails.modifiedOn,
                    modifiedBy:  statusDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Status Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Status Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Status Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteStatus = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const staff = await Status.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this Status', true, 200, staff, 'Successfully Remove Status');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this Status', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
