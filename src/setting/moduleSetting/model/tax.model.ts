import * as mongoose from 'mongoose'


export interface TaxDocument extends mongoose.Document {
    tax?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const taxSchema = new mongoose.Schema({
    tax: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Tax = mongoose.model("Tax", taxSchema)