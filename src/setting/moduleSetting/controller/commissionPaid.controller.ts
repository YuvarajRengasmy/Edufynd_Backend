import { CommissionPaid, CommissionPaidDocument } from '../model/commissionPaid.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-DropDown Setting In All Module";



export const getAllCommissionPaid = async (req, res) => {
    try {
        const data = await CommissionPaid.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-CommissionPaid', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-CommissionPaid', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCommissionPaid = async (req, res) => {
    try {
        const data = await CommissionPaid.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-CommissionPaid', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-CommissionPaid', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCommissionPaid = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: CommissionPaidDocument = req.body;
            const createData = new CommissionPaid(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-CommissionPaid', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-CommissionPaid', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-CommissionPaid', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateCommissionPaid = async (req, res) => {
    const DropdownListDetails: CommissionPaidDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await CommissionPaid.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
     
      existingModule.commissionPaidOn =  DropdownListDetails.commissionPaidOn 

  let updatedModule = await existingModule.save();
   
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-CommissionPaid', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Create-CommissionPaid', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteCommissionPaid = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await CommissionPaid.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the CommissionPaid', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the CommissionPaid', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredCommissionPaid = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.commissionPaidOn) {
                andList.push({ commissionPaidOn: req.body.commissionPaidOn })
            }
           
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await CommissionPaid.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await CommissionPaid.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter CommissionPaid', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter CommissionPaid', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };