import { Currency, CurrencyDocument } from '../../globalSetting/model/currency.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Global-Currency";



export const getAllCurrency = async (req, res) => {
    try {
        const data = await Currency.find()
        response(req, res, activity, 'Level-1', 'GetAll-Currency', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Currency', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCurrency = async (req, res) => {
    try {
        const data = await Currency.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Currency', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Currency', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCurrency = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const currencyDetails: CurrencyDocument = req.body;
            const createData = new Currency(currencyDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Currency', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Currency', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Currency', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let deleteCurrency = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const currency = await Currency.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Currency', true, 200, currency, 'Successfully Remove Currency');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Currency', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
