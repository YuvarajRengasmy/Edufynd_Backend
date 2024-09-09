import { PopularCategory, PopularCategoryDocument } from '../model/popularCourse.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-DropDown Setting In All Module";



export const getAllPopularCategory = async (req: any, res:any, next:any) => {
    try {
        const data = await PopularCategory.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-PopularCategory', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-PopularCategory', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSinglePopularCategory = async (req: any, res:any, next:any) => {
    try {
        const data = await PopularCategory.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-PopularCategory', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-PopularCategory', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createPopularCategory = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: PopularCategoryDocument = req.body;
            const createData = new PopularCategory(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-PopularCategory', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-PopularCategory', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-PopularCategory', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};




export const updatePopularCategory = async (req: any, res:any, next:any) => {
    const DropdownListDetails: PopularCategoryDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await PopularCategory.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
     
      existingModule.popularCategories = DropdownListDetails.popularCategories

      let updatedModule = await existingModule.save();
    
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-PopularCategory', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Create-PopularCategory', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deletePopularCategory = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const country = await PopularCategory.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the PopularCategory', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the PopularCategory', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredPopularCategory = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
         
            if (req.body.popularCategories) {
                andList.push({ popularCategories: req.body.popularCategories })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await PopularCategory.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await PopularCategory.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter PopularCategory', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter PopularCategory', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };