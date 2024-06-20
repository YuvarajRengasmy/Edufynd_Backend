import * as mongoose from 'mongoose'


export interface ContactDocument extends mongoose.Document{
    name?: string;
    email?: string;
    mobileNumber?: string;
    message?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const contactSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    mobileNumber: {type: String},
    message: {type: String},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Contact = mongoose.model("Contact", contactSchema)