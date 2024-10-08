import { InTake, InTakeDocument } from '../../globalSetting/model/intake.model'
import { Logs } from "../../../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Global-InTake";



export const getAllInTake = async (req: any, res:any, next:any) => {
    try {
        const data = await InTake.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-InTake', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-InTake', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleInTake = async (req: any, res:any, next:any) => {
    try {
        const data = await InTake.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-InTake', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-InTake', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let getAllLoggedInTake = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "InTake" })
        response(req, res, activity, 'Level-1', 'All-Logged InTake', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged InTake', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedInTake = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged InTake', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged InTake', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged InTake', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }

export let createInTake = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const intakeData: InTakeDocument = req.body;
            const createData = new InTake(intakeData);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-InTake', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-InTake', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-InTake', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateInTake = async (req: any, res:any, next:any) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const intakeData: InTakeDocument = req.body;
            let statusData = await InTake.findByIdAndUpdate({_id: req.query._id }, {
                $set: {
                    intakeName: intakeData.intakeName,
                    startDate: intakeData.startDate,
                    endDate: intakeData.endDate,
                 
                    modifiedOn: new Date(),
                    modifiedBy:  intakeData.modifiedBy,
                },
              
            },{ new: true });

            response(req, res, activity, 'Level-2', 'Update-InTakeData', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-InTakeData', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-InTakeData', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteInTake = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const data = await InTake.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this InTake', true, 200, data, 'Successfully Remove InTake');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this InTake', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredInTake   = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.from) {
            andList.push({ from: req.body.from })
        }
        if (req.body.to) {
            andList.push({ to: req.body.to })
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const intakeList = await InTake.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const intakeCount = await InTake.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterInTak', true, 200, { intakeList, intakeCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterInTake', false, 500, {}, errorMessage.internalServer, err.message);
    }
};