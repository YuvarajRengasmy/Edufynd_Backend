import { Event, EventDocument } from './event.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Event";



export const getAllEvent = async (req, res) => {
    try {
        const data = await Event.find()
        response(req, res, activity, 'Level-1', 'GetAll-Event', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Event', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleEvent = async (req, res) => {
    try {
        const data = await Event.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Event', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Event', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: EventDocument = req.body;
            const createData = new Event(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Event', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Event', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Event', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateEvent = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const eventData: EventDocument = req.body;
            let statusData = await Event.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    typeOfUser: eventData.typeOfUser,
                    userName: eventData.userName,

                    eventTopic: eventData.eventTopic,
                    date: eventData.date,
                    time: eventData.time,
                    venue: eventData.venue,

                    modifiedOn: new Date(),
                    modifiedBy: eventData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-Event', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Event', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Event', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteEvent = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await Event.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Event', true, 200, data, 'Successfully Remove Event');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Event', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredEvent = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.typeOfUser) {
            andList.push({ typeOfUser: req.body.typeOfUser })
        }
        if (req.body.venue) {
            andList.push({ venue: req.body.venue })
        }
        if (req.body.userName) {
            andList.push({ userName: req.body.userName })
        }
        if (req.body.eventTopic) {
            andList.push({ eventTopic: req.body.eventTopic })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const eventList = await Event.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const eventCount = await Event.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterEvent', true, 200, { eventList, eventCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterEvent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};