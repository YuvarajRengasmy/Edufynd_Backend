import * as mongoose from 'mongoose'



export interface EventDocument extends mongoose.Document {
    typeOfUser?: string;
    userName?: any[];
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

    typeOfUser: {type: String},
    userName: [String],
    eventTopic: {type: String},
    date: {type: Date},
    time: {type: String},
    venue: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Event = mongoose.model("Event", eventSchema)