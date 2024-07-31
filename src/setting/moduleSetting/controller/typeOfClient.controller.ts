import { TypeOfClient, TypeOfClientDocument } from '../model/typeOfClient.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-All Module-Program-CourseType";



export const getAllTypeOfClient = async (req, res) => {
    try {
        const data = await TypeOfClient.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-TypeOfClient', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-TypeOfClient', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleTypeOfClient = async (req, res) => {
    try {
        const data = await TypeOfClient.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-TypeOfClient', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-TypeOfClient', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createTypeOfClient = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails:TypeOfClientDocument = req.body;
            const createData = new TypeOfClient(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-TypeOfClient', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-TypeOfClient', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-TypeOfClient', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateTypeOfClient = async (req, res) => {
    const DropdownListDetails: TypeOfClientDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await TypeOfClient.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
      existingModule.typeOfClient = DropdownListDetails.typeOfClient; // Assuming courseType is the only field being updated
      // Save the updated module
     let updatedModule = await existingModule.save();
         
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-TypeOfClient', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-TypeOfClient', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteTypeOfClient= async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await TypeOfClient.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the TypeOfClient', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the TypeOfClient', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredTypeOfClient = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.typeOfClient) {
                andList.push({ typeOfClient: req.body.typeOfClient })
            }
            
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await TypeOfClient.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await TypeOfClient.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter TypeOfClient', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter TypeOfClient', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };