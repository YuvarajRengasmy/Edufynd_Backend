import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


export interface EventDocument extends mongoose.Document {
    hostName?: string;
    hostEmail?: string;
    fileUpload?: any[],
    content?: string;
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    eventTopic?: string;
    universityName?: string;
    staffId?: any;
    staffName?: string;
    
    date?: Date;
    time?: string;
    venue?: string;
    sent?: Boolean;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const eventSchema = new mongoose.Schema({
    hostName: {type: String},
    hostEmail: {type: String},

    fileUpload: [{
        _id: { type: mongoose.Types.ObjectId, auto: true },
        fileName: { type: String},
        fileImage:  { type: String },
    }],
    content: {type: String},
    typeOfUser: {type: String},
    userName: [String],
    userEmail: [String],
    eventTopic: {type: String},
    universityName: {type: String},

    date: {type: Date},
    time: {type: String},
    venue: {type: String},
    sent: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    staffName: { type: String},
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

LoggingMiddleware(eventSchema)
export const Event = mongoose.model("Event", eventSchema)