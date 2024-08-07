import { PayRoll, PayRollDocument } from '../model/payroll.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "PayRoll";


export const getAllPayRoll = async (req, res) => {
    try {
        const data = await PayRoll.find().sort({ _id: -1 })
      
        response(req, res, activity, 'Level-1', 'GetAll-PayRoll', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-PayRoll', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSinglePayRoll = async (req, res) => {
    try {
        const data = await PayRoll.findOne({ _id: req.query._id })
  
        response(req, res, activity, 'Level-1', 'GetSingle-PayRoll', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-PayRoll', false, 500, {}, errorMessage.internalServer, err.message)
    }
}




export let createPayRoll = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const payRollDetails:PayRollDocument = req.body;
            const createData = new PayRoll(payRollDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-PayRoll', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updatePayRoll = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
          
            const payRollDetails:PayRollDocument = req.body;
            const updateData = await PayRoll.findOneAndUpdate({ _id: payRollDetails._id }, {
                $set: {  
                    houseRent: payRollDetails.houseRent,
                    conveyance: payRollDetails.conveyance,
                    otherAllowance: payRollDetails.otherAllowance,
                    pf: payRollDetails.pf,
                    taxDeduction: payRollDetails.taxDeduction,
                    grossSalary: payRollDetails.grossSalary,
                    totalDeduction: payRollDetails.totalDeduction,
                    netSalary: payRollDetails.netSalary,
                    uploadDocument: payRollDetails.uploadDocument,

                    modifiedOn: new Date(),
               
                }
            });
            response(req, res, activity, 'Level-2', 'Update-PayRoll', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-PayRoll', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deletePayRoll = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await PayRoll.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the PayRoll', true, 200, country, 'Successfully Remove the PayRoll Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let getFilteredPayRoll = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.houseRent) {
                andList.push({ houseRent: req.body.houseRent })
            }
            if (req.body.conveyance) {
                andList.push({ conveyance: req.body.conveyance })
            }
            if (req.body.otherAllowance) {
                andList.push({ otherAllowance: req.body.otherAllowance })
            }
            if (req.body.grossSalary) {
                andList.push({ grossSalary: req.body.grossSalary })
            }
            if (req.body.netSalary) {
                andList.push({ netSalary: req.body.netSalary })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}
         
            const payRollList = await PayRoll.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const payRollCount = await PayRoll.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter PayRoll', true, 200, { payRollList, payRollCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter PayRoll', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };