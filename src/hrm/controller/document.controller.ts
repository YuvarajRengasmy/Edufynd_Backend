import { Upload, UploadDocument } from '../model/document.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Upload";



export const getAllDocument = async (req: any, res:any, next:any) => {
    try {
        const data = await Upload.find().sort({ _id: -1 })
      
        response(req, res, activity, 'Level-1', 'GetAll-Upload', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Upload', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleDocument = async (req: any, res:any, next:any) => {
    try {
        const data = await Upload.findOne({ _id: req.query._id })
  
        response(req, res, activity, 'Level-1', 'GetSingle-Upload', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Upload', false, 500, {}, errorMessage.internalServer, err.message)
    }
}




export let createDocument = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const documentDetails: UploadDocument = req.body;
            const createData = new Upload(documentDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-1', 'Create-Upload', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-Upload', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Upload', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateDocument = async (req: any, res:any, next:any) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const documentDetails: UploadDocument = req.body;
            const updateData = await Upload.findOneAndUpdate({ _id: documentDetails._id }, {
                $set: {  
                    uploadDocument: documentDetails.uploadDocument,

                    modifiedOn: new Date(),
              
                }
            });
            response(req, res, activity, 'Level-1', 'Update-Upload', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Upload', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Upload', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deleteDocument= async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const country = await Upload.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Upload Document', true, 200, country, 'Successfully Remove the Upload Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Upload Document', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let getFilteredDocument = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })

            if (req.body.uploadDocument) {
                andList.push({ uploadDocument: req.body.uploadDocument })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}
         
            const documentList = await Upload.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const documentCount = await Upload.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Upload Document', true, 200, { documentList, documentCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Upload Document', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };