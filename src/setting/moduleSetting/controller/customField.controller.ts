// import { CustomField, CustomFieldDocument } from '../../moduleSetting/model/customField.model'
// import { validationResult } from "express-validator";
// import { response, } from "../../../helper/commonResponseHandler";
// import { clientError, errorMessage } from "../../../helper/ErrorMessage";


// var activity = "ModuleSetting-Add Label";



// export const getAllCustomField = async (req, res) => {
//     try {
//         const data = await CustomField.find()
//         response(req, res, activity, 'Level-1', 'GetAll-CustomFields', true, 200, data, clientError.success.fetchedSuccessfully)

//     } catch (err: any) {
//         response(req, res, activity, 'Level-1', 'GetAll-CustomFields', false, 500, {}, errorMessage.internalServer, err.message)
//     }
// }


// export const getSingleCustomFields = async (req, res) => {
//     try {
//         const data = await CustomField.findOne({ _id: req.query._id })
//         response(req, res, activity, 'Level-1', 'GetSingle-CustomFields', true, 200, data, clientError.success.fetchedSuccessfully)
//     } catch (err: any) {
//         response(req, res, activity, 'Level-1', 'GetSingle-CustomFields', false, 500, {}, errorMessage.internalServer, err.message)
//     }
// }


// export let createCustomFields = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const CustomField: CustomFieldDocument = req.body;
//             const createData = new UniversityList(UniversityListDetails);
//             let insertData = await createData.save();
//             response(req, res, activity, 'Level-2', 'Create-UniversityList', true, 200, insertData, clientError.success.savedSuccessfully);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Create-UniversityList', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {
//         response(req, res, activity, 'Level-3', 'Create-UniversityList', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// };


// export const updateUniversityList = async (req, res) => {
//     const errors = validationResult(req)
//     if (errors.isEmpty()) {
//         try {
//             const UniversityListDetails: UniversityListDocument = req.body;
//             let statusData = await UniversityList.findByIdAndUpdate({ _id: UniversityListDetails._id }, {
//                 $set: {
//                     courseType: UniversityListDetails.courseType,
//                     popularCategories: UniversityListDetails.popularCategories,
//                     country: UniversityListDetails.country,
//                     offerTAT: UniversityListDetails.offerTAT,
//                     institutionType:UniversityListDetails.institutionType,
//                     paymentMethod: UniversityListDetails.paymentMethod,
//                     tax:UniversityListDetails.tax,
//                     commissionPaidOn: UniversityListDetails.commissionPaidOn,

//                     modifiedOn: UniversityListDetails.modifiedOn,
//                     modifiedBy:  UniversityListDetails.modifiedBy,
//                 }
//             });

//             response(req, res, activity, 'Level-2', 'Update-UniversityList', true, 200, statusData, clientError.success.updateSuccess);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Update-UniversityList', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Update-UniversityList', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }

// export let deleteUniversityList = async (req, res, next) => {
  
//     try {
//         let id = req.query._id;
//         const country = await UniversityList.findByIdAndDelete({ _id: id })
//         response(req, res, activity, 'Level-2', 'Deleted the UniversityList', true, 200, country, 'Successfully Remove UniversityList');
//     }
//     catch (err: any) {
//         response(req, res, activity, 'Level-3', 'Deleted the UniversityList', false, 500, {}, errorMessage.internalServer, err.message);
//     }
// };


