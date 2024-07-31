import { CourseTypeList, CourseTypeListDocument } from '../model/courseType.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-All Module-Program-CourseType";



export const getAllCourseTypeList = async (req, res) => {
    try {
        const data = await CourseTypeList.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Course Type', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Course Type', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCourseTypeList = async (req, res) => {
    try {
        const data = await CourseTypeList.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Course Type', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Course Type', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCourseType = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: CourseTypeListDocument = req.body;
            const createData = new CourseTypeList(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Course Type', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Course Type', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Course Type', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateCourseTypeList = async (req, res) => {
    const DropdownListDetails: CourseTypeListDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await CourseTypeList.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
      existingModule.courseType = DropdownListDetails.courseType; // Assuming courseType is the only field being updated
      // Save the updated module
     let updatedModule = await existingModule.save();
         
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-CourseTypeList', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-CourseTypeList', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteCourseType = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await CourseTypeList.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Course Type', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Course Type', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredCourseType = async (req, res, next) => {
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

            const dropDownList = await CourseTypeList.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await CourseTypeList.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Course Type', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Course Type', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };