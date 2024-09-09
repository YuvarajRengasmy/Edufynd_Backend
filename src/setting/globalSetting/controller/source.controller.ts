import { Source, SourceDocument } from '../../globalSetting/model/source.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Global setting - Source";



export const getAllSource = async (req: any, res:any, next:any) => {
    try {
        const data = await Source.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Source', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Source', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleSource = async (req: any, res:any, next:any) => {
    try {
        const data = await Source.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Source', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Source', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createSource = async (req: any, res:any, next:any) => {
    console.log("balan")
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const sourceDetails: SourceDocument = req.body;
            const createData = new Source(sourceDetails);
            let insertData = await createData.save();
            console.log("ppp", insertData)
            response(req, res, activity, 'Level-2', 'Create-Source', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Source', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Source', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateSource = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const sourceDetails: SourceDocument = req.body;

            const sourceData = await Source.findByIdAndUpdate(
                { _id: req.query._id },
                {
                    $set: {
                        sourceName: sourceDetails.sourceName,
                        modifiedOn: new Date(),
          
                    },
                },
                { new: true }
            );

            if (!sourceData) {
                return response(req, res, activity, 'Level-2', 'Update-Source Details', false, 404, {},  'Source not found');
            }

            response(req, res, activity, 'Level-2', 'Update-Source Details', true, 200, sourceData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-Source Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Source Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteSource = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const staff = await Source.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this Source', true, 200, staff, 'Successfully Remove Source');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this Source', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let getFilteredSource   = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.sourceName) {
            andList.push({ sourceName: req.body.sourceName })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const sourceList = await Source.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const sourceCount = await Source.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStatus', true, 200, { sourceList, sourceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterStatus', false, 500, {}, errorMessage.internalServer, err.message);
    }
};