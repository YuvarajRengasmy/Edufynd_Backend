import { CommissionType, TypeOfCommissionDocument } from '../model/typeOfCommission.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Type Of Commission";



export const getAllCommissionType = async (req: any, res:any, next:any) => {
    try {
        const data = await CommissionType.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-CommissionType', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-CommissionType', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCommissionType = async (req: any, res:any, next:any) => {
    try {
        const data = await CommissionType.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-CommissionType', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-CommissionType', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCommissionType = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: TypeOfCommissionDocument = req.body;
            const createData = new CommissionType(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-CommissionType', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-CommissionType', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-CommissionType', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateCommissionType = async (req: any, res:any, next:any) => {
    const DropdownListDetails: TypeOfCommissionDocument = req.body;
    
    try {
      const existingModule = await CommissionType.findById({ _id: DropdownListDetails._id });
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
   

      const statusData = await CommissionType.findByIdAndUpdate(
        { _id: req.query._id },
        {
            $set: {
                commissionValue: DropdownListDetails.commissionValue,
                paymentType: DropdownListDetails.paymentType,
                paymentStatus: DropdownListDetails.paymentStatus,
                paymentValue1:DropdownListDetails.paymentValue1,
                paymentStatus1:DropdownListDetails.paymentStatus1,
                paymentValue2: DropdownListDetails.paymentValue2,
                paymentStatus2: DropdownListDetails.paymentStatus2,
                paymentValue3: DropdownListDetails.paymentValue3,
                paymentStatus3:DropdownListDetails.paymentStatus3,
                modifiedOn: new Date(),
            
            },
        },
        { new: true }
    );

  let updatedModule = await statusData.save();
      response(req, res, activity, 'Level-2', 'Update-CommissionType', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-CommissionType', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    export let deleteCommissionType = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const data = await CommissionType.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the CommissionType', true, 200, data, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the CommissionType', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



    export let getFilteredCommissionType = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.commission) {
                andList.push({ commission: req.body.commission })
            }
           
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await CommissionType.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await CommissionType.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter CommissionType', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter CommissionType', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };