import * as mongoose from 'mongoose'

export interface MeetingDocument extends mongoose.Document {
    hostName?: string;
    attendees?: any[];
    subject?: string;
    content?: string;
    date?: Date;
    time?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const meetingSchema = new mongoose.Schema({

    hostName: {type: String},
    attendees: [String],
    subject: {type: String},
    content: {type: String},
    date: {type: Date},
    time: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Meeting = mongoose.model("Meeting", meetingSchema)