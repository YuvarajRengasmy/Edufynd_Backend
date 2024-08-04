import { Department, DepartmentDocument } from '../model/department.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Department";



export const getAllDepartment = async (req, res) => {
    try {
        const data = await Department.find().sort({ _id: -1 })
      
        response(req, res, activity, 'Level-1', 'GetAll-Department', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Department', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleDepartment = async (req, res) => {
    try {
        const data = await Department.findOne({ _id: req.query._id })
  
        response(req, res, activity, 'Level-1', 'GetSingle-Department', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Department', false, 500, {}, errorMessage.internalServer, err.message)
    }
}




export let createDepartment = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const departmentDetails: DepartmentDocument = req.body;
            const createData = new Department(departmentDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Department', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Department', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Department', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateDepartment = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
          
            const departmentDetails: DepartmentDocument = req.body;
            const updateData = await Department.findOneAndUpdate({ _id: departmentDetails._id }, {
                $set: {  
                    name: departmentDetails.name,
                    departmentHead: departmentDetails.departmentHead,

                    modifiedOn: new Date(),
                    modifiedBy:  departmentDetails.modifiedBy,
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Department', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Department', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Department', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deleteDepartment = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await Department.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Department', true, 200, country, 'Successfully Remove the Department Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Department', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let getFilteredDepartment = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.name) {
                andList.push({ name: req.body.name })
            }
            if (req.body.departmentHead) {
                andList.push({ departmentHead: req.body.departmentHead })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}
         
            const departmentList = await Department.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const departmentCount = await Department.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Department', true, 200, { departmentList, departmentCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Department', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };