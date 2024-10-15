import * as mongoose from 'mongoose'


export interface ExpenseDocument extends mongoose.Document {
    // Expense Report
    expenseDate?: string;
    typeOfUser?: string;
    paidName?: string;
    value?: number;
    branch?: string;
    acceptType?: string;
    attachment?: string;
    typeOfExpenses?: string;
    amountPaidBy?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const expenseSchema = new mongoose.Schema({
    expenseDate: { type: String },
    typeOfUser: { type: String },
    paidName: { type: String },
    value: { type: Number },
    branch: { type: String },
    acceptType: { type: String },
    attachment: { type: String },
    typeOfExpenses: { type: String },
    amountPaidBy: {type: String},

    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Expense = mongoose.model('ExpenseReport', expenseSchema)