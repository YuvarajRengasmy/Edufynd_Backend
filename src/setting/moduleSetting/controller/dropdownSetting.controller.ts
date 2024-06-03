import { DropDownList, DropDownListDocument } from '../model/dropdownSetting.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-DropDown Setting In All Module";



export const getAllDropDownList = async (req, res) => {
    try {
        const data = await DropDownList.find()
        response(req, res, activity, 'Level-1', 'GetAll-DropDown', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-DropDown', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleDropDownList = async (req, res) => {
    try {
        const data = await DropDownList.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-DropDown', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-DropDown', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCustomLabel = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: DropDownListDocument = req.body;
            const createData = new DropDownList(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-DropDownList', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-DropDownList', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-DropDownList', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateDropDownList = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: DropDownListDocument = req.body;
            let statusData = await DropDownList.findByIdAndUpdate({ _id: DropdownListDetails._id }, {
                $set: {
                    courseType: DropdownListDetails.courseType,
                    popularCategories: DropdownListDetails.popularCategories,
                    country: DropdownListDetails.country,
                    offerTAT: DropdownListDetails.offerTAT,
                    institutionType: DropdownListDetails.institutionType,
                    paymentMethod: DropdownListDetails.paymentMethod,
                    tax: DropdownListDetails.tax,
                    commissionPaidOn: DropdownListDetails.commissionPaidOn,
                    typeOfClient: DropdownListDetails.typeOfClient,

                    modifiedOn: DropdownListDetails.modifiedOn,
                    modifiedBy: DropdownListDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-DropdownList', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-DropdownList', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-DropdownList', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteDropDownList = async (req, res, next) => {

    try {
        let id = req.query._id;
        const country = await DropDownList.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the DropdownList', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the DropdownList', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


