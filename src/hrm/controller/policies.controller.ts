import { Policies, PoliciesDocument } from '../model/policies.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Policies";



export const getAllPolicies = async (req, res) => {
    try {
        const data = await Policies.find().sort({ _id: -1 })
      
        response(req, res, activity, 'Level-1', 'GetAll-Policies', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Policies', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSinglePolicies = async (req, res) => {
    try {
        const data = await Policies.findOne({ _id: req.query._id })
  
        response(req, res, activity, 'Level-1', 'GetSingle-Policies', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Policies', false, 500, {}, errorMessage.internalServer, err.message)
    }
}




export let createPolicies = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const policiesDetails:PoliciesDocument = req.body;
            const createData = new Policies(policiesDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Policies', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Policies', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Policies', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updatePolicies = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
          
            const policiesDetails: PoliciesDocument = req.body;
            const updateData = await Policies.findOneAndUpdate({ _id: policiesDetails._id }, {
                $set: {  
                    title: policiesDetails.title,
                    department: policiesDetails.department,
                    description: policiesDetails.description,
                    uploadFile: policiesDetails.uploadFile,

                    modifiedOn: new Date(),
                    modifiedBy:  policiesDetails.modifiedBy,
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Policies', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Policies', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Policies', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deletePolicies = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await Policies.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Policies', true, 200, country, 'Successfully Remove the Policies Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Policies', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let getFilteredPolicies = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.title) {
                andList.push({ title: req.body.title })
            }
            if (req.body.department) {
                andList.push({ department: req.body.department })
            }
            if (req.body.description) {
                andList.push({ description: req.body.description })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}
         
            const policiesList = await Policies.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const policiesCount = await Policies.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Policies', true, 200, { policiesList, policiesCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Policies', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };

    export const getPoliciesStaff = async (req, res) => {
        try {
            
            const data = await Policies.find({
                designation:req.params.department
            }).sort({ _id: -1 })
      
            response(req, res, activity, 'Level-1', 'GetSingle-Department', true, 200, data, clientError.success.fetchedSuccessfully)
        } catch (err: any) {
            response(req, res, activity, 'Level-1', 'GetSingle-Department', false, 500, {}, errorMessage.internalServer, err.message)
        }
    }