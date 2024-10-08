import { Year, YearDocument } from '../../globalSetting/model/year.model'
import { Logs } from "../../../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Global-Year";



export const getAllYear = async (req: any, res:any, next:any) => {
    try {
        const data = await Year.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Year', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Year', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleYear = async (req: any, res:any, next:any) => {
    try {
        const data = await Year.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Year', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Year', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

export let getAllLoggedYear = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Year" })
        response(req, res, activity, 'Level-1', 'All-Logged Year', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Year', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedYear = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged Year', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged Year', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged Year', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


export let createYear = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const yearDetails: YearDocument = req.body;
            const createData = new Year(yearDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Year', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Year', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Year', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateYear = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);


    if (errors.isEmpty()) {
        try {
            const yearDetails: YearDocument = req.body;

            const yearData = await Year.findByIdAndUpdate(
                { _id: req.query._id },
                {
                    $set: {
                        year: yearDetails.year,
                      
                        modifiedOn: new Date(),
                        modifiedBy: yearDetails.modifiedBy,
                    },
                },
                { new: true }
            );

            if (!yearData) {
                return response(req, res, activity, 'Level-2', 'Update-Year Details', false, 404, {},  'Year not found');
            }

            response(req, res, activity, 'Level-2', 'Update-Year Details', true, 200, yearData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-Year Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Year Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteYear = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const year = await Year.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this Year', true, 200, year, 'Successfully Remove Year');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this Year', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let getFilteredYear   = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        // andList.push({ status: 1 })
        if (req.body.year) {
            andList.push({ year: req.body.year })
        }
   
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const yearList = await Year.find(findQuery).limit(limit).skip(page)

        const yearCount = await Year.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter-Year', true, 200, { yearList, yearCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter-Year', false, 500, {}, errorMessage.internalServer, err.message);
    }
};