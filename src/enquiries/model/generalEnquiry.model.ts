import * as mongoose from 'mongoose'


export interface GeneralEnquiryDocument extends mongoose.Document{
    studentId?: string,
    country?: string;
    universityName?: string;
    name?: string;
    email?: string;
    dial?: string;
    mobileNumber?: number;   
    message?: string;
    typeOfUser?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const generalEnquirySchema = new mongoose.Schema({
    studentId: {type: String},
    country: {type: String},
    universityName: {type: String},
    name: {type: String},
    email: {type: String},
    dial:{type: String},
    mobileNumber: {type: Number},
    message: {type: String},
    typeOfUser: {type: String},
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const GeneralEnquiry = mongoose.model("GeneralEnquiry", generalEnquirySchema)