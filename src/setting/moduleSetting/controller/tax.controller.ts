import { Tax, TaxDocument } from '../model/tax.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-All Module-Program-CourseType";



export const getAllTax = async (req, res) => {
    try {
        const data = await Tax.find()
        response(req, res, activity, 'Level-1', 'GetAll-Tax', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Tax', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleTax = async (req, res) => {
    try {
        const data = await Tax.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Tax', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Tax', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createTax = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails:TaxDocument = req.body;
            const createData = new Tax(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Tax', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Tax', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Tax', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateTax = async (req, res) => {
    const DropdownListDetails: TaxDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await Tax.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
      existingModule.tax = DropdownListDetails.tax; // Assuming courseType is the only field being updated
      // Save the updated module
     let updatedModule = await existingModule.save();
         
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-CourseTypeList', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-CourseTypeList', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteTax= async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await Tax.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Tax', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Tax', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredTax = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.courseType) {
                andList.push({ courseType: req.body.courseType })
            }
            
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await Tax.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

            const dropDownCount = await Tax.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Tax', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Tax', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };