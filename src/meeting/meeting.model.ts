import * as mongoose from 'mongoose'

export interface MeetingDocument extends mongoose.Document {
    hostName?: string;

    hostEmail?: string;
    typeOfUser?: string;

    attendees?: any[];
    userEmail?: any[];
    subject?: string;
    content?: string;
    date?: Date;
    time?: string;
    scheduledTime?: Date;
    sent?: Boolean;

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

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Meeting = mongoose.model("Meeting", meetingSchema)