import { DepartmentHead, DepartmentHeadDocument } from '../model/departmentHead.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "DepartmentHead";



export const getAllDepartmentHead= async (req: any, res:any, next:any) => {
    try {
        const data = await DepartmentHead.find().sort({ _id: -1 })
      
        response(req, res, activity, 'Level-1', 'GetAll-DepartmentHead', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-DepartmentHead', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleDepartmentHead = async (req: any, res:any, next:any) => {
    try {
        const data = await DepartmentHead.findOne({ _id: req.query._id })
  
        response(req, res, activity, 'Level-1', 'GetSingle-DepartmentHead', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-DepartmentHead', false, 500, {}, errorMessage.internalServer, err.message)
    }
}




export let createDepartmentHead = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const departmentDetails: DepartmentHeadDocument = req.body;
            const createData = new DepartmentHead(departmentDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-DepartmentHead', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-DepartmentHead', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-DepartmentHead', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateDepartmentHead = async (req: any, res:any, next:any) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const departmentDetails: DepartmentHeadDocument = req.body;
            const updateData = await DepartmentHead.findOneAndUpdate({ _id: departmentDetails._id }, {
                $set: {  
                    departmentHead: departmentDetails.department,

                    modifiedOn: new Date(),
              
                }
            });
            response(req, res, activity, 'Level-2', 'Update-DepartmentHead', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-DepartmentHead', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-DepartmentHead', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deleteDepartmentHead = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const country = await DepartmentHead.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the DepartmentHead', true, 200, country, 'Successfully Remove the DepartmentHead Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the DepartmentHead', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let getFilteredDepartmentHead = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })

            if (req.body.departmentHead) {
                andList.push({ departmentHead: req.body.departmentHead })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}
         
            const departmentList = await DepartmentHead.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const departmentCount = await DepartmentHead.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter DepartmentHead', true, 200, { departmentList, departmentCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter DepartmentHead', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };