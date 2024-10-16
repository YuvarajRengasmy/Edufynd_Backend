import * as mongoose from 'mongoose'


export interface ExpenseDocument extends mongoose.Document {
    typeOfExpense?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const typeOfExpenseSchema = new mongoose.Schema({
    typeOfExpense: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const TypeOfExpense = mongoose.model("TypeOfExpense", typeOfExpenseSchema)