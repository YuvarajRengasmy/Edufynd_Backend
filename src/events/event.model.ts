import * as mongoose from 'mongoose'



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
    
    date?: Date;
    time?: string;
    venue?: string;
    sent?: Boolean;

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

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Event = mongoose.model("Event", eventSchema)