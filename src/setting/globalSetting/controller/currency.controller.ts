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




export let getFilteredCurrency = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.currency) {
            andList.push({ currency: req.body.currency })
        }
        if (req.body.flag) {
            andList.push({ flag: req.body.flag })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const currencyList = await Currency.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const currencyCount = await Currency.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterCurrency', true, 200, { currencyList, currencyCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterCurrency', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
