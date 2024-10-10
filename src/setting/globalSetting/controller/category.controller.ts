import { Category,CategoryDocument } from '../model/category.model'
import { Logs } from "../../../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Globel-Setting-Blog-Category";



export const getAllCategory = async (req: any, res:any, next:any) => {
    try {
        const data = await Category.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Category', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Category', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCategory = async (req: any, res:any, next:any) => {
    try {
        const data = await Category.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Category', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Category', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let getAllLoggedCategory = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Category" })
        response(req, res, activity, 'Level-1', 'All-Logged Category', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedCategory = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged Category', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged Category', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }

export let createCategory = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails:CategoryDocument = req.body;
            const createData = new Category(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-1', 'Create-Category', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-Category', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Category', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};




export const updateCategory = async (req: any, res:any, next:any) => {
    const DropdownListDetails:CategoryDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await Category.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
     
      existingModule.categoryName = DropdownListDetails.categoryName

      let updatedModule = await existingModule.save();
    
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-1', 'Update-Category', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Create-Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


export let deleteCategory = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const country = await Category.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-1', 'Deleted the Category', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Deleted the Category', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



export let getFilteredCategory = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
         
            if (req.body.categoryName) {
                andList.push({ categoryName: req.body.categoryName })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await Category.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await Category.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Category', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Get-Filter Category', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };