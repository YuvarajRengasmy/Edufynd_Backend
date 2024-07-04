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