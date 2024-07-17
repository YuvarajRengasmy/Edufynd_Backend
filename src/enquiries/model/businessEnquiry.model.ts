import * as mongoose from 'mongoose'


export interface BusinessEnquiryDocument extends mongoose.Document{
    studentId?: string,
    country?: string;
    universityName?: string;
    name?: string;
    email?: string;
    mobileNumber?: number;   //a
    message?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const businessEnquirySchema = new mongoose.Schema({
    studentId: {type: String},
    country: {type: String},
    universityName: {type: String},
    name: {type: String},
    email: {type: String},
    mobileNumber: {type: Number},
    message: {type: String},
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const BusinessEnquiry = mongoose.model("BusinessEnquiry", businessEnquirySchema)