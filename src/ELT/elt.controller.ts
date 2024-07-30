import { ELT, ELTDocument } from './elt.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "ELT";



export const getAllELT = async (req, res) => {
    try {
        const data = await ELT.find()
        response(req, res, activity, 'Level-1', 'GetAll-ELT', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-ELT', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleELT = async (req, res) => {
    try {
        const data = await ELT.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-ELT', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-ELT', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createELT = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: ELTDocument = req.body;
            const createData = new ELT(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-ELT', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-ELT', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-ELT', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateELT = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const eltData: ELTDocument = req.body;
            let statusData = await ELT.findByIdAndUpdate({ _id: eltData._id }, {
                $set: {

                    studentName: eltData.studentName,
                    testName: eltData.testName,
                    time: eltData.time,
                    date: eltData.date,
    
                    modifiedOn: new Date(),
                    modifiedBy: eltData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-ELT', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-ELT', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-ELT', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteELT = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await ELT.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the ELT', true, 200, data, 'Successfully Remove ELT');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the ELT', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredELT = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.date) {
            andList.push({ date: req.body.date })
        }
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
      
        if (req.body.testName) {
            andList.push({ testName: req.body.testName })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const eltList = await ELT.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const eltCount = await ELT.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter ELT', true, 200, { eltList, eltCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter ELT', false, 500, {}, errorMessage.internalServer, err.message);
    }
};