import { Email, EmailDocument } from '../../globalSetting/model/email.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Global-Email-Template";



export const getAllEmailTemplate = async (req, res) => {
    try {
        const data = await Email.find()
        response(req, res, activity, 'Level-1', 'GetAll-Email', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Email', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleTemplate = async (req, res) => {
    try {
        const data = await Email.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Template', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Template', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createEmailTemplate = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const templateData: EmailDocument = req.body;
            const createData = new Email(templateData);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Email-Template', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Email-Template', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Email-Template', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateTemplate = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const templateData: EmailDocument = req.body;
            let statusData = await Email.findByIdAndUpdate({ _id: templateData._id }, {
                $set: {
                    subject: templateData.subject,
                    content: templateData.content,
                    modifiedOn: templateData.modifiedOn,
                    modifiedBy:  templateData.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Template Data', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Template Data', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Template Data', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteTemplate = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const email = await Email.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this Status', true, 200, email, 'Successfully Remove the Template');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this Status', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredEmail = async (req, res, next) => {
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

        const emailList = await Email.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const emailCount = await Email.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterEmail', true, 200, { emailList, emailCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterEmail', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

