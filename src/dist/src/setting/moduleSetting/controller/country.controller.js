"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCities = exports.getCountryByState = exports.getFilteredCountryList = exports.deleteCountryList = exports.updateCountryList = exports.createCountryList = exports.getSingleCountryList = exports.getAllCountryList = void 0;
const country_model_1 = require("../model/country.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../../../helper/commonResponseHandler");
const ErrorMessage_1 = require("../../../helper/ErrorMessage");
var activity = "ModuleSetting-CountryList";
const getAllCountryList = async (req, res) => {
    try {
        const data = await country_model_1.CountryList.find();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-CountryList', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-CountryList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllCountryList = getAllCountryList;
const getSingleCountryList = async (req, res) => {
    try {
        const data = await country_model_1.CountryList.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-CountryList', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetSingle-CountryList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleCountryList = getSingleCountryList;
let createCountryList = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails = req.body;
            const createData = new country_model_1.CountryList(DropdownListDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Create-CountryList', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-CountryList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Create-CountryList', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.createCountryList = createCountryList;
const updateCountryList = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const countryDetails = req.body;
            let statusData = await country_model_1.CountryList.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    name: countryDetails.name,
                    code: countryDetails.code,
                    modifiedOn: new Date(),
                    modifiedBy: countryDetails.modifiedBy,
                },
                $addToSet: {
                    state: countryDetails.state,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-CountryList Details', true, 200, statusData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-CountryList Details', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-CountryList Details', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateCountryList = updateCountryList;
let deleteCountryList = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await country_model_1.CountryList.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Deleted the CountryList', true, 200, country, 'Successfully Remove this Field');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Deleted the CountryList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteCountryList = deleteCountryList;
let getFilteredCountryList = async (req, res, next) => {
    try {
        var findQuery;
        var andList = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        andList.push({ status: 1 });
        if (req.body.name) {
            andList.push({ name: req.body.name });
        }
        if (req.body.code) {
            andList.push({ code: req.body.code });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {};
        const dropDownList = await country_model_1.CountryList.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page);
        const dropDownCount = await country_model_1.CountryList.find(findQuery).count();
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Filter CountryList', true, 200, { dropDownList, dropDownCount }, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Filter CountryList', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getFilteredCountryList = getFilteredCountryList;
const getCountryByState = async (req, res) => {
    const { name } = req.query; // Extract country from query params
    try {
        // Query universities based on country
        const countryList = await country_model_1.CountryList.find({ name: name });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Get-CountryList By State ', true, 200, countryList, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        console.error('Error fetching universities:', err);
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-CountryList By State ', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getCountryByState = getCountryByState;
const getAllCities = async (req, res) => {
    const { state } = req.query;
    try {
        const { state } = req.params;
        const cities = await state.find({ state: state });
        res.status(200).json(cities);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAllCities = getAllCities;
// export const getCountryByStateAndCity = async (req, res) => {
//     const { countryName, stateName, cityName } = req.query;
//     try {
//         // Find the matching state and city in the CountryList collection
//         const countryList = await CountryList.findOne({
//             name: countryName,
//             'state.name': stateName,
//             'state.cities': cityName
//         }, {
//             name: 1,
//             code: 1,
//             'state.$': 1
//         }).exec();
//         if (!countryList) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'State or city not found in the specified country'
//             });
//         }
//         console.log("Country list data:", countryList);
//         // Format the response data
//         const data = {
//             countryName: countryList.name,
//             code: countryList.code,
//             state: countryList.state[0].name,
//             cities: countryList.state[0].cities
//         };
//         // Send the response
//         res.status(200).json({
//             success: true,
//             data: data,
//             message: 'Data fetched successfully'
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: err.message
//         });
//     }
// };
//# sourceMappingURL=country.controller.js.map