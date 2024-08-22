import { DialCode, DialCodeDocument } from '../model/dialCode.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "DialCode";



export const getAllDialCode = async (req, res) => {
    try {
        const data = await DialCode.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-DialCode', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-DialCode', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleDialCode = async (req, res) => {
    try {
        const data = await DialCode.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-DialCode', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-DialCode', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



export let getFilteredDialCode = async (req, res, next) => {
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
            if (req.body.flag) {
                andList.push({ flag: req.body.flag })
            } 
            if (req.body.dialCode) {
                andList.push({ dialCode: req.body.dialCode })
            }  
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dialCodeList = await DialCode.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dialCodeCount = await DialCode.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter DialCode', true, 200, { dialCodeList, dialCodeCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter DialCode', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };




   