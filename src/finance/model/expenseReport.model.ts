import * as mongoose from 'mongoose'


export interface InvoiceDocument extends mongoose.Document {

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

const expenseSchema = new mongoose.Schema({
    expenseDate: { type: String },
    nameOfExpense: { type: String },
    paidAgainst: { type: String },
    expenseAmount: { type: String },

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Expense = mongoose.model('Expense', expenseSchema)