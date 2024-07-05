import { CustomField, CustomFieldDocument } from '../../moduleSetting/model/customField.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-Add Label";



export const getAllCustomField = async (req, res) => {
    try {
        const data = await CustomField.find()
        response(req, res, activity, 'Level-1', 'GetAll-CustomFields', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-CustomFields', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCustomFields = async (req, res) => {
    try {
        const data = await CustomField.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-CustomFields', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-CustomFields', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCustomFields = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Customdata: CustomFieldDocument = req.body;
            const createData = new CustomField(Customdata);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-CustomField', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-CustomField', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-CustomField', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateCustomField = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const customLabel: CustomFieldDocument = req.body;
            let statusData = await CustomField.findByIdAndUpdate({ _id: req.query._id}, {
                $set: {
                    customFieldFor:customLabel.customFieldFor,
                    fieldLabel: customLabel.fieldLabel,
                    defaultValue: customLabel.defaultValue,
                    helpText: customLabel.helpText,
                    fieldType: customLabel.fieldType,
                    thisFieldIsRequired: customLabel.thisFieldIsRequired,
                    showOnTable:customLabel.showOnTable,
                    visibleForAdminOnly: customLabel.visibleForAdminOnly,
                    visibleForClient: customLabel.visibleForClient,
                    active: customLabel.active,

                    modifiedOn: new Date(),
                    modifiedBy: customLabel.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-LabelFields', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-LabelFields', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-LabelFields', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteCustomField = async (req, res, next) => {

    try {
        let id = req.query._id;
        const country = await CustomField.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the UniversityList', true, 200, country, 'Successfully Remove UniversityList');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the UniversityList', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


