import * as mongoose from 'mongoose'

export interface ApplicationStatusDocument extends mongoose.Document{
    _id?: any;
    statusName?: string;
    duration?: string;
    subCategory?: any[];
    position?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const applicationStatusSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    statusName: {type: String},
    duration:{ type: String},
    subCategory: [String],
    position: {type: Number},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const ApplicationStatus = mongoose.model("ApplicationStatus", applicationStatusSchema)