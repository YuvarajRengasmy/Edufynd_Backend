import { Income, IncomeDocument } from '../model/incomeReport.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Income Report";

export const getAllIncomeReport = async (req: any, res:any, next:any) => {
    try {
        const data = await Income.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Income Report', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Income Report', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleIncomeReport = async (req: any, res:any, next:any) => {
    try {
        const data = await Income.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Income Report', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetSingle-Income Report', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


const generateNextIncomeID = async (currentMaxCounter): Promise<string> => {
    const newCounter = currentMaxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    return `IR_${formattedCounter}`;
};


export let createIncomeReport = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: IncomeDocument = req.body;

            const income = await Income.find({}, 'incomeId').exec();
            const maxCounter = income.reduce((max, expense) => {
                const incomeID = expense.incomeId;
                const counter = parseInt(incomeID.split('_')[1], 10);
                return counter > max ? counter : max;
            }, 100);
            let currentMaxCounter = maxCounter;
            statusDetails.incomeId = await generateNextIncomeID(currentMaxCounter);

            const createData = new Income(statusDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-1', 'Create-Income Report', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-Income Report', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Income Report', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateIncome = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: IncomeDocument = req.body;

            const statusData = await Income.findByIdAndUpdate(
                { _id: req.query._id },
                {
                    $set: {
                        incomeDate: statusDetails.incomeDate,
                        typeOfClient: statusDetails.typeOfClient,
                        clientName: statusDetails.clientName,
                        value:statusDetails.value,
                        branch: statusDetails.branch,
                        acceptType: statusDetails.acceptType,
                        attachment: statusDetails.attachment,
                        amount: statusDetails.amount,
                   
                        modifiedOn: new Date(),
                        modifiedBy: statusDetails.modifiedBy,
                    },
                },
                { new: true }
            );

            if (!statusData) {
            response(req, res, activity, 'Level-2', 'Update-Income Report', false, 404, {},  'Income Report not found');
            }

            response(req, res, activity, 'Level-2', 'Update-Income Report', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-Income Report', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Income Report', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteIncomeReport = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const staff = await Income.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Income Report', true, 200, staff, 'Successfully Remove Income Report');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Income Report', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let getFilteredIncomeReport = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.incomeDate) {
            andList.push({ incomeDate: req.body.incomeDate })
        }
        if (req.body.typeOfClient) {
            andList.push({ typeOfClient: req.body.typeOfClient })
        }
        if (req.body.clientName) {
            andList.push({ clientName: req.body.clientName })
        }
        if (req.body.value) {
            andList.push({ value: req.body.value })
        }
        if (req.body.branch) {
            andList.push({ branch: req.body.branch })
        }
        if (req.body.amount) {
            andList.push({ amount: req.body.amount })
        }
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const statusList = await Income.find(findQuery).sort({ _id: 1 }).limit(limit).skip(page)

        const statusCount = await Income.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Income Report', true, 200, { statusList, statusCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Income Report', false, 500, {}, errorMessage.internalServer, err.message);
    }
};