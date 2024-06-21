import * as mongoose from 'mongoose'


export interface BlogDocument extends mongoose.Document{
  title?: string;
  introduction?: string;
  content1?: string;
  content2?: string;
  content3?: string;
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