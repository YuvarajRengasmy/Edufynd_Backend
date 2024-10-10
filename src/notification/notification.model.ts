import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


export interface NotificationDocument extends mongoose.Document {
    studentId?: any;
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    subject?: string;
    content?: string;
    staffId?: any;
    staffName?: string;
    scheduledTime?: Date;
    sent?: Boolean;
    uploadFile?:any[];
    hostName?: string;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const notificationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    typeOfUser: {type: String},
    userName: [String],
    userEmail: [String],
    subject: {type: String},
    content: {type: String},
    uploadFile: [{fileName: { type: String}, uploadImage: { type: String} }],
    hostName:{type: String},
    scheduledTime: {type: Date},
    sent: { type: Boolean, default: false },
    uploadImage: { type: String },
    isActive: {type: String,default: "InActive"},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    staffName: { type: String},
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

LoggingMiddleware(notificationSchema)
export const Notification = mongoose.model("Notification", notificationSchema)