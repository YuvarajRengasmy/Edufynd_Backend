import * as mongoose from 'mongoose'



export interface NotificationDocument extends mongoose.Document {
    typeOfUser?: string;
    userName?: any[];
    subject?: string;
    content?: string;
    uploadImage?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const notificationSchema = new mongoose.Schema({

    typeOfUser: {type: String},
    userName: [String],
    subject: {type: String},
    content: {type: String},
    uploadImage: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Notification = mongoose.model("Notification", notificationSchema)