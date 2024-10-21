import { TypeOfExpense, ExpenseDocument } from '../model/typeOfExpenses.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "Type Of Commission";



export const getAllExpense = async (req: any, res:any, next:any) => {
    try {
        const data = await TypeOfExpense.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-TypeOfExpense', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-TypeOfExpense', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleExpense = async (req: any, res:any, next:any) => {
    try {
        const data = await TypeOfExpense.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-TypeOfExpense', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-TypeOfExpense', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createExpense = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: ExpenseDocument = req.body;
            const createData = new TypeOfExpense(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-TypeOfExpense', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-TypeOfExpense', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-TypeOfExpense', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateExpense = async (req: any, res:any, next:any) => {
    const DropdownListDetails: ExpenseDocument = req.body;
    
    try {
      const existingModule = await TypeOfExpense.findById({ _id: DropdownListDetails._id });
      if (!existingModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
   

      const statusData = await TypeOfExpense.findByIdAndUpdate(
        { _id: req.query._id },
        {
            $set: {
                typeOfExpense: DropdownListDetails.typeOfExpense,
              
                modifiedOn: new Date(),
            
            },
        },
        { new: true }
    );

  let updatedModule = await statusData.save();
      response(req, res, activity, 'Level-2', 'Update-TypeOfExpense', true, 200, updatedModule, clientError.success.updateSuccess);
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Update-TypeOfExpense', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


export let deleteExpense = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const data = await TypeOfExpense.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the TypeOfExpense', true, 200, data, 'Successfully Remove this Expense');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the TypeOfExpense', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



export let getFilteredExpense = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.typeOfExpense) {
                andList.push({ typeOfExpense: req.body.typeOfExpense })
            }
           
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await TypeOfExpense.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await TypeOfExpense.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter TypeOfExpense', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter TypeOfExpense', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };