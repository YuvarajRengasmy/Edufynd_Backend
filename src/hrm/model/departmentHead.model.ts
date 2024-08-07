import * as mongoose from 'mongoose'

export interface DepartmentHeadDocument extends mongoose.Document{
    _id?: any;
    departmentHead?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const departmentHeadSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    departmentHead: {type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const DepartmentHead = mongoose.model("DepartmentHead", departmentHeadSchema)