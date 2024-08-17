import { InstitutionType, InstitutionTypeDocument } from '../model/institiutionType.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-All Module-Program-CourseType";



export const getAllInstitutionType = async (req: any, res:any, next:any) => {
    try {
        const data = await InstitutionType.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-InstitutionType', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-InstitutionType', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleInstitutionType = async (req: any, res:any, next:any) => {
    try {
        const data = await InstitutionType.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-InstitutionType', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-InstitutionType', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createInstitutionType = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: InstitutionTypeDocument = req.body;
            const createData = new InstitutionType(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-InstitutionType', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-InstitutionType', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-InstitutionType', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateInstitutionType = async (req: any, res:any, next:any) => {
    const DropdownListDetails: InstitutionTypeDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await InstitutionType.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
      existingModule.institutionType = DropdownListDetails.institutionType; // Assuming courseType is the only field being updated
      // Save the updated module
     let updatedModule = await existingModule.save();
         
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-InstitutionType', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-InstitutionType', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteInstitutionType = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const country = await InstitutionType.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the InstitutionType', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the InstitutionType', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredInstitutionType = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.institutionType) {
                andList.push({ courseType: req.body.institutionType })
            }
            
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await InstitutionType.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await InstitutionType.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter InstitutionType', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter InstitutionType', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };