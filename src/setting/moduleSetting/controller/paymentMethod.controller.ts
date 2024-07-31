import { PaymentMethod, PaymentMethodDocument } from '../model/paymentMethod.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting-All Module-Program-CourseType";



export const getAllPaymentMethod = async (req, res) => {
    try {
        const data = await PaymentMethod.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-PaymentMethod', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-PaymentMethod', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSinglePaymentMethod = async (req, res) => {
    try {
        const data = await PaymentMethod.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-PaymentMethod', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-PaymentMethod', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createPaymentMethod= async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: PaymentMethodDocument = req.body;
            const createData = new PaymentMethod(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Payment Method', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Payment Method', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Payment Method', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updatePaymentMethod = async (req, res) => {
    const DropdownListDetails: PaymentMethodDocument = req.body;
    
    try {
      // Check if the module exists
      const existingModule = await PaymentMethod.findById({ _id: DropdownListDetails._id });
   
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      // Update the module with the new data
      existingModule.paymentMethod = DropdownListDetails.paymentMethod; // Assuming courseType is the only field being updated
      // Save the updated module
     let updatedModule = await existingModule.save();
         
      
      // Respond with success message and updated module data
      response(req, res, activity, 'Level-2', 'Update-PaymentMethod', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-PaymentMethod', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deletePaymentMethod = async (req, res, next) => {

        try {
            let id = req.query._id;
            const country = await PaymentMethod.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the PaymentMethod', true, 200, country, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the PaymentMethod', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredPaymentMethod = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.paymentMethod) {
                andList.push({ paymentMethod: req.body.paymentMethod })
            }
            
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await PaymentMethod.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await PaymentMethod.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Course Type', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Course Type', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };