import { Meeting, MeetingDocument } from './meeting.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Meeting";



export const getAllMeeting = async (req, res) => {
    try {
        const data = await Meeting.find()
        response(req, res, activity, 'Level-1', 'GetAll-Meeting', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Meeting', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleMeeting = async (req, res) => {
    try {
        const data = await Meeting.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Meeting', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Meeting', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createMeeting = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: MeetingDocument = req.body;
            const createData = new Meeting(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Meeting', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Meeting', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Meeting', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateMeeting = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const meetingData: MeetingDocument = req.body;
            let statusData = await Meeting.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    hostName: meetingData.hostName,
                    attendees: meetingData.attendees,
                    subject: meetingData.subject,
                    content: meetingData.content,
                    date: meetingData.date,
                    time: meetingData.time,

                    modifiedOn: new Date(),
                    modifiedBy: meetingData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-Meeting', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Meeting', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Meeting', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteMeeting = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await Meeting.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Meeting', true, 200, data, 'Successfully Remove Meeting');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Meeting', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredMeeting = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.hostName) {
            andList.push({ hostName: req.body.hostName })
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject })
        }
        if (req.body.attendees) {
            andList.push({ attendees: req.body.attendees })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const meetingList = await Meeting.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const meetingCount = await Meeting.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Meeting', true, 200, { meetingList, meetingCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Meeting', false, 500, {}, errorMessage.internalServer, err.message);
    }
};