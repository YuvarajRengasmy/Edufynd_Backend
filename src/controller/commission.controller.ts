import { Commission, CommissionDocument } from '../model/commission.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Commission";

export const getAllCommission = async (req, res) => {
    try {
        const data = await Commission.find().sort({ _id: -1 })
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

export const getSingleUniversity = async (req, res) => {
    try {
        const data = await Commission.findOne({universityId:req.query.universityId})
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



export let createCommission = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const commission = await Commission.findOne({ universityName: req.body.universityName });
            if(!commission){
            const commissionDetails: CommissionDocument = req.body;
            commissionDetails.createdOn = new Date()
            const createData = new Commission(commissionDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Commission', true, 200, insertData, clientError.success.savedSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Commission', true, 422, {}, 'University Name already registered for Commission');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Commission', false, 500, {}, errorMessage.fieldValidation, err.message);
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
            const updateData = await Commission.findOneAndUpdate({ _id: commissionDetails._id }, {
                $set: {  
                    country: commissionDetails.country,
                    universityName: commissionDetails.universityName,
                    paymentMethod: commissionDetails.paymentMethod,
                    amount: commissionDetails.amount,
                    percentage:commissionDetails.percentage,
                    commissionPaidOn: commissionDetails.commissionPaidOn,
                    eligibility: commissionDetails.eligibility,
                    tax: commissionDetails.tax,
                    paymentType: commissionDetails.paymentType,
                    currency:commissionDetails.currency,
                    flag: commissionDetails.flag,
                    clientName:commissionDetails.clientName,

                    modifiedOn: new Date(),
                    modifiedBy:  commissionDetails.modifiedBy,
                },
                $addToSet: {
                    years: commissionDetails.years,
                 
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
            response(req, res, activity, 'Level-2', 'Deleted the Commission', true, 200, country, 'Successfully Remove the Commission Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let deleteCourseType = async (req, res, next) => {

        try {
            let commissionId = req.query.commissionId; // The main document's _id
            let yearId = req.query.yearId; // The _id of the year containing the courseType
            let courseTypeId = req.query.courseTypeId; // The _id of the courseType to be deleted
            const updateResult = await Commission.updateOne(
                { _id: commissionId, 'years._id': yearId },
                { $pull: { 'years.$.courseTypes': { _id: courseTypeId } } }
            );

            console.log("33", updateResult)
    
            if (updateResult.modifiedCount === 0) {
                return response(req, res, 'activity', 'Level-3', 'Delete Course Type', false, 404, {}, 'Course Type not found');
            }
    
            const updatedDocument = await Commission.findById(commissionId);
            response(req, res, 'activity', 'Level-2', 'Deleted the Course Type', true, 200, updatedDocument, 'Successfully removed the course type');
        } catch (err) {
            console.log("77", err)
            response(req, res, 'activity', 'Level-3', 'Delete Course Type', false, 500, {}, 'Internal Server Error', err.message);
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
         
            const dropDownList = await Commission.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await Commission.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Commission', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };