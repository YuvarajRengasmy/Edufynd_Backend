import * as mongoose from 'mongoose'



export interface NotificationDocument extends mongoose.Document {
    studentId?: any;
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    subject?: string;
    content?: string;
    uploadImage?: string;

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
    uploadImage: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Notification = mongoose.model("Notification", notificationSchema)