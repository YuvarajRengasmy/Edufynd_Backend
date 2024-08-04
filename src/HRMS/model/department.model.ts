import * as mongoose from 'mongoose'

export interface DepartmentDocument extends mongoose.Document{
    _id?: any;
    name?: string;
    departmentHead?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const departmentHeadSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: {type: String},
    departmentHead: {type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Department = mongoose.model("Department", departmentHeadSchema)