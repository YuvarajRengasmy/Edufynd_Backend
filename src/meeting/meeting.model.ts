import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'

export interface MeetingDocument extends mongoose.Document {
    hostName?: string;

    hostEmail?: string;
    typeOfUser?: string;

    attendees?: any[];
    content?: string;
    userEmail?: any[];
    subject?: string;
    staffId?: any;
    staffName?: string;
   
    date?: Date;
    time?: string;
    scheduledTime?: Date;
    sent?: Boolean;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const meetingSchema = new mongoose.Schema({

    hostName: {type: String},
    
    hostEmail: {type: String},
    typeOfUser: {type: String},

    attendees: [String],
    userEmail: [String],
    subject: {type: String},
    content: {type: String},
    date: {type: Date},
    time: {type: String},
    scheduledTime: {type: Date},
    sent: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    staffName: { type: String},
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

LoggingMiddleware(meetingSchema)
export const Meeting = mongoose.model("Meeting", meetingSchema)