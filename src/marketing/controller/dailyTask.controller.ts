import { DailyTask, DailyTaskDocument } from '../model/dailyTask.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "DailyTask";



export const getAllDailyTask = async (req, res) => {
    try {
        const data = await DailyTask.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-DailyTask', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-DailyTask', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleDailyTask = async (req, res) => {
    try {
        const data = await DailyTask.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-DailyTask', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-DailyTask', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createDailyTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: DailyTaskDocument = req.body;
            const createData = new DailyTask(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-DailyTask', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-DailyTask', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-DailyTask', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateDailyTask = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const dailyTaskData: DailyTaskDocument = req.body;
            let statusData = await DailyTask.findByIdAndUpdate({ _id: dailyTaskData._id }, {
                $set: {

                    seoType: dailyTaskData.seoType,
                    link1: dailyTaskData.link1,
                    platformType: dailyTaskData.platformType,
                    link2: dailyTaskData.link2,
                    posterName: dailyTaskData.posterName,
                    content: dailyTaskData.content,
                
                    modifiedOn: new Date(),
                    modifiedBy: dailyTaskData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-DailyTask', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-DailyTask', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-DailyTask', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteDailyTask = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await DailyTask.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the DailyTask', true, 200, data, 'Successfully Remove DailyTask');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the DailyTask', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredDailyTask = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.seoType) {
            andList.push({ seoType: req.body.seoType })
        }
        if (req.body.platformType) {
            andList.push({ platformType: req.body.platformType })
        }

        if (req.body.posterName) {
            andList.push({ posterName: req.body.posterName })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const dailyTaskList = await DailyTask.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const dailyTaskCount = await DailyTask.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter DailyTask', true, 200, { dailyTaskList, dailyTaskCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter DailyTask', false, 500, {}, errorMessage.internalServer, err.message);
    }
};