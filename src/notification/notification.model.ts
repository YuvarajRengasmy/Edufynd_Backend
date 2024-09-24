import * as mongoose from 'mongoose'



export interface NotificationDocument extends mongoose.Document {
    studentId?: any;
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    subject?: string;
    content?: string;
    
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
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Notification = mongoose.model("Notification", notificationSchema)