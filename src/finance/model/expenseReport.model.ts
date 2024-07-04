import * as mongoose from 'mongoose'


export interface InvoiceDocument extends mongoose.Document{

 // Expense Report
expenseDate?: string;
nameOfExpense?: string;
paidAgainst?: string;
expenseAmount?: string;

createdOn?: Date;
createdBy?: string;
modifiedOn?: Date;
modifiedBy?: string;
}