import { UniversityList, UniversityListDocument } from '../model/dropdownSetting.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-DropDown Setting In All Module";



export const getAllUniversityList = async (req, res) => {
    try {
        const data = await UniversityList.find()
        response(req, res, activity, 'Level-1', 'GetAll-UniversityDropDown', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-UniversityDropDown', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleUniversityList = async (req, res) => {
    try {
        const data = await UniversityList.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-UniversityDropDown', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-UniversityDropDown', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createUniversityList = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const UniversityListDetails: UniversityListDocument = req.body;
            const createData = new UniversityList(UniversityListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-UniversityList', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-UniversityList', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-UniversityList', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateUniversityList = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const UniversityListDetails: UniversityListDocument = req.body;
            let statusData = await UniversityList.findByIdAndUpdate({ _id: UniversityListDetails._id }, {
                $set: {
                    courseType: UniversityListDetails.courseType,
                    popularCategories: UniversityListDetails.popularCategories,
                    country: UniversityListDetails.country,
                    offerTAT: UniversityListDetails.offerTAT,
                    institutionType: UniversityListDetails.institutionType,
                    paymentMethod: UniversityListDetails.paymentMethod,
                    tax: UniversityListDetails.tax,
                    commissionPaidOn: UniversityListDetails.commissionPaidOn,
                    typeOfClient: UniversityListDetails.typeOfClient,

                    modifiedOn: UniversityListDetails.modifiedOn,
                    modifiedBy: UniversityListDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-UniversityList', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-UniversityList', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-UniversityList', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteUniversityList = async (req, res, next) => {

    try {
        let id = req.query._id;
        const country = await UniversityList.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the UniversityList', true, 200, country, 'Successfully Remove UniversityList');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the UniversityList', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


