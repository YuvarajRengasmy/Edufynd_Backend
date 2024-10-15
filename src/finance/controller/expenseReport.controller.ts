import { Expense, ExpenseDocument } from '../model/expenseReport.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Expense Report";

export const getAllExpenseReport = async (req: any, res:any, next:any) => {
    try {
        const data = await Expense.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Expense Report', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Expense Report', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleExpenseReport = async (req: any, res:any, next:any) => {
    try {
        const data = await Expense.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Expense Report', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetSingle-Expense Report', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createExpenseReport = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: ExpenseDocument = req.body;
            const createData = new Expense(statusDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-1', 'Create-Expense Report', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-Expense Report', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Expense Report', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateExpense = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: ExpenseDocument = req.body;

            const statusData = await Expense.findByIdAndUpdate(
                { _id: req.query._id },
                {
                    $set: {
                        expenseDate: statusDetails.expenseDate,
                        typeOfUser: statusDetails.typeOfUser,
                        paidName: statusDetails.paidName,
                        value:statusDetails.value,
                        branch: statusDetails.branch,
                        acceptType: statusDetails.acceptType,
                        attachment: statusDetails.attachment,
                        typeOfExpenses: statusDetails.typeOfExpenses,
                        amountPaidBy: statusDetails.amountPaidBy,
                   
                        modifiedOn: new Date(),
                        modifiedBy: statusDetails.modifiedBy,
                    },
                },
                { new: true }
            );

            if (!statusData) {
            response(req, res, activity, 'Level-2', 'Update-Expense Report', false, 404, {},  'Expense Report not found');
            }

            response(req, res, activity, 'Level-2', 'Update-Expense Report', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-Expense Report', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Expense Report', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteExpenseReport = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const staff = await Expense.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Expense Report', true, 200, staff, 'Successfully Remove Expense Report');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Expense Report', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredExpenseReport = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.expenseDate) {
            andList.push({ expenseDate: req.body.expenseDate })
        }
        if (req.body.typeOfUser) {
            andList.push({ typeOfUser: req.body.typeOfUser })
        }
        if (req.body.paidName) {
            andList.push({ paidName: req.body.paidName })
        }
        if (req.body.value) {
            andList.push({ value: req.body.value })
        }
        if (req.body.branch) {
            andList.push({ branch: req.body.branch })
        }
        if (req.body.typeOfExpenses) {
            andList.push({ typeOfExpenses: req.body.typeOfExpenses })
        }
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const statusList = await Expense.find(findQuery).sort({ _id: 1 }).limit(limit).skip(page)

        const statusCount = await Expense.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Expense Report', true, 200, { statusList, statusCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Expense Report', false, 500, {}, errorMessage.internalServer, err.message);
    }
};