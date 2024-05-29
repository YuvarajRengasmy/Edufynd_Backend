import * as mongoose from 'mongoose'


export interface StatusDocument extends mongoose.Document{
    statusName?: string;
    duration?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const statusSchema = new mongoose.Schema({
    statusName: {type: String},
    duration:{ type: String},

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

export const Status = mongoose.model("Status", statusSchema)