import * as mongoose from 'mongoose'

export interface PoliciesDocument extends mongoose.Document{
    _id?: any;
    title?: string;
    department?: string;
    description?: string;
    uploadFile?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const policiesHeadSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    title: {type: String},
    department: {type: String},
    description: {type: String},
    uploadFile: {type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Policies = mongoose.model("Policies", policiesHeadSchema)