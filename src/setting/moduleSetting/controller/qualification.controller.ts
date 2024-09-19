import { Qualification, QualificationDocument } from '../model/qualification.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-Qualification";



export const getAllQualification = async (req: any, res:any, next:any) => {
    try {
        const data = await Qualification.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Qualification', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Qualification', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleQualification = async (req, res) => {
    try {
        const data = await Qualification.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Qualification', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Qualification', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createQualification = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails:QualificationDocument = req.body;
            const createData = new Qualification(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-1', 'Create-Qualification', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-Qualification', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Qualification', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateQualification = async (req, res) => {
    const DropdownListDetails: QualificationDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await Qualification.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
      existingModule.highestQualification = DropdownListDetails.highestQualification; // Assuming courseType is the only field being updated
      // Save the updated module
     let updatedModule = await existingModule.save();
         
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-Qualification', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-Qualification', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteQualification = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await Qualification.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Qualification', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Qualification', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredQualification = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.highestQualification) {
                andList.push({ highestQualification: req.body.highestQualification })
            }
            
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await Qualification.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await Qualification.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Qualification', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Get-Filter Qualification', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };