import * as mongoose from 'mongoose'



export interface EventDocument extends mongoose.Document {
    hostName?: string;
    hostEmail?: string;
    attendees?: any[];
    content?: string;
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    eventTopic?: string;
    universityName?: string;
    date?: Date;
    time?: string;
    venue?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const eventSchema = new mongoose.Schema({
    hostName: {type: String},
    hostEmail: {type: String},
    attendees: [String],
    content: {type: String},
    typeOfUser: {type: String},
    userName: [String],
    userEmail: [String],
    eventTopic: {type: String},
    universityName: {type: String},
    date: {type: Date},
    time: {type: String},
    venue: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Event = mongoose.model("Event", eventSchema)