import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


export interface PromotionDocument extends mongoose.Document {
    typeOfUser?: string;
    userName?: any[];
    userEmail?: any[];
    subject?: string;
    content?: string;
    uploadImage?: string;
    fileUpload?: any[];
    staffId?: any;
    staffName?: string;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const promotionSchema = new mongoose.Schema({

    typeOfUser: {type: String},
    userName: [String],
    userEmail: [String],
    subject: {type: String},
    content: {type: String},
    uploadImage: {type: String},
    fileUpload: [{
        _id: { type: mongoose.Types.ObjectId, auto: true },
        fileName: { type: String},
        fileImage:  { type: String },
    }],
    isActive: {type: String,default: "InActive"},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    staffName: { type: String},
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

LoggingMiddleware(promotionSchema)
export const Promotion = mongoose.model("Promotion", promotionSchema)