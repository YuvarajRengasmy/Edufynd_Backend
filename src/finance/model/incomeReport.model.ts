import * as mongoose from 'mongoose'


export interface InvoiceDocument extends mongoose.Document{
 // Income Report
incomeDate?: string;
nameOfIncome?: string;
receivedFrom?: string;
incomeAmount?: string;

createdOn?: Date;
createdBy?: string;
modifiedOn?: Date;
modifiedBy?: string;
}

const incomeSchema = new mongoose.Schema({
    incomeDate: {type: String},
nameOfIncome: {type: String},
receivedFrom: {type: String},
incomeAmount: {type: String},

createdOn: { type: Date, default: Date.now() },
createdBy: { type: String },
modifiedOn: { type: Date },
modifiedBy: { type: String },

})

export const Income = mongoose.model("Income", incomeSchema)