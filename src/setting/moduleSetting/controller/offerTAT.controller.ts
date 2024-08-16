import { OfferTAT, OfferTATDocument } from '../model/offerTAT.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-All Module-Program-CourseType";



export const getAllOfferTAT = async (req: any, res:any, next:any) => {
    try {
        const data = await OfferTAT.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-OfferTAT', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-OfferTAT', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleOfferTAT = async (req: any, res:any, next:any) => {
    try {
        const data = await OfferTAT.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-OfferTAT', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-OfferTAT', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createOfferTAT = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: OfferTATDocument = req.body;
            const createData = new OfferTAT(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-OfferTAT', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-OfferTAT', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-OfferTAT', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateOfferTAT = async (req: any, res:any, next:any) => {
    const DropdownListDetails: OfferTATDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await OfferTAT.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
      existingModule.offerTAT = DropdownListDetails.offerTAT; // Assuming courseType is the only field being updated
      // Save the updated module
     let updatedModule = await existingModule.save();
         
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-CourseTypeList', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-CourseTypeList', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteOfferTAT = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const country = await OfferTAT.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the OfferTAT', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the OfferTAT', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredOfferTAT = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.offerTAT) {
                andList.push({ offerTAT: req.body.offerTAT })
            }
            
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await OfferTAT.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await OfferTAT.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter OfferTAT', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter OfferTAT', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };