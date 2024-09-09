import { ApplicationStatus, ApplicationStatusDocument } from '../../moduleSetting/model/applicationStatus.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting ApplicationStatus";



export const getAllApplicationStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await ApplicationStatus.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-ApplicationStatus', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-ApplicationStatus', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleApplicationStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await ApplicationStatus.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-ApplicationStatus', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-ApplicationStatus', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createApplicationStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: ApplicationStatusDocument = req.body;
            const createData = new ApplicationStatus(statusDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-ApplicationStatus', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-ApplicationStatus', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-ApplicationStatus', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateApplicationStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: ApplicationStatusDocument = req.body;

            const statusData = await ApplicationStatus.findByIdAndUpdate(
                { _id: req.query._id },
                {
                    $set: {
                        statusName: statusDetails.statusName,
                        duration: statusDetails.duration,
                        modifiedOn: new Date(),
                        modifiedBy: statusDetails.modifiedBy,
                    },
                },
                { new: true }
            );

            if (!statusData) {
                return response(req, res, activity, 'Level-2', 'Update-ApplicationStatus Details', false, 404, {},  'ApplicationStatus not found');
            }

            response(req, res, activity, 'Level-2', 'Update-ApplicationStatus Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-ApplicationStatus Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-ApplicationStatus Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteApplicationStatus = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const staff = await ApplicationStatus.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this ApplicationStatus', true, 200, staff, 'Successfully Remove ApplicationStatus');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this ApplicationStatus', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let getFilteredApplicationStatus   = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.statusName) {
            andList.push({ statusName: req.body.statusName })
        }
        if (req.body.duration) {
            andList.push({ duration: req.body.duration })
        }
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const statusList = await ApplicationStatus.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const statusCount = await ApplicationStatus.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStatus', true, 200, { statusList, statusCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterStatus', false, 500, {}, errorMessage.internalServer, err.message);
    }
};