import { Status, StatusDocument } from '../../globalSetting/model/status.model'
import { Logs } from "../../../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Global Status";



export const getAllStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await Status.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Status', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Status', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await Status.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Status', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Status', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let getAllLoggedStatus = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Status" })
        response(req, res, activity, 'Level-1', 'All-Logged Status', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Status', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedStatus = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged Status', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged Status', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged Status', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


export let createStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: StatusDocument = req.body;
            const createData = new Status(statusDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Status', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Status', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Status', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: StatusDocument = req.body;

            const statusData = await Status.findByIdAndUpdate(
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
                return response(req, res, activity, 'Level-2', 'Update-Status Details', false, 404, {},  'Status not found');
            }

            response(req, res, activity, 'Level-2', 'Update-Status Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-Status Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Status Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteStatus = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const staff = await Status.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this Status', true, 200, staff, 'Successfully Remove Status');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this Status', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let getFilteredStatus   = async (req: any, res:any, next:any) => {
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

        const statusList = await Status.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const statusCount = await Status.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStatus', true, 200, { statusList, statusCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterStatus', false, 500, {}, errorMessage.internalServer, err.message);
    }
};