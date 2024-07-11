import { Commission, CommissionDocument } from '../model/commission.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Commission";



export const getAllCommission = async (req, res) => {
    try {
        const data = await Commission.find()
        response(req, res, activity, 'Level-1', 'GetAll-Commission', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Commission', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCommission = async (req, res) => {
    try {
        const data = await Commission.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCommission = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const commissionDetails: CommissionDocument = req.body;
            const createData = new Commission(commissionDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Commission', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Commission', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateCommission = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const commissionDetails : CommissionDocument = req.body;
            const updateData = await Commission.findOneAndUpdate({ _id: req.body._id }, {
                $set: {  
                    country: commissionDetails.country,
                    universityName: commissionDetails.universityName,
                    paymentMethod: commissionDetails.paymentMethod,
                    commissionPaidOn: commissionDetails.commissionPaidOn,
                    eligibility: commissionDetails.eligibility,
                    tax: commissionDetails.tax,
                    paymentType: commissionDetails.paymentType,
                    year: commissionDetails.year,
                    courseType: commissionDetails.courseType
              
                },
                $addToSet: {
                    inTake: commissionDetails.inTake,
                 
                }
                
            });
            response(req, res, activity, 'Level-2', 'Update-Commission', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Commission', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deleteCommission = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await Commission.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Commission', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredCommission = async (req, res, next) => {
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
            if (req.body.commissionPaidOn) {
                andList.push({ commissionPaidOn: req.body.commissionPaidOn })
            }
            if (req.body.paymentMethod) {
                andList.push({ paymentMethod: req.body.paymentMethod })
            }
            if (req.body.tax) {
                andList.push({ tax: req.body.tax })
            }
           
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await Commission.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

            const dropDownCount = await Commission.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Commission', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };