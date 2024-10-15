import * as mongoose from 'mongoose'


export interface IncomeDocument extends mongoose.Document {
    // Income Report
    incomeDate?: string;
    typeOfClient?: string;
    clientName?: string;
    value?: number;
    branch?: string;
    acceptType?: string;
    attachment?: string;
    amount?: number;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const incomeSchema = new mongoose.Schema({
    incomeDate: { type: String },
    typeOfClient: { type: String },
    clientName: { type: String },
    value: { type: Number },
    branch: { type: String },
    acceptType: { type: String },
    attachment: { type: String },
    amount: {type: Number},

    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Income = mongoose.model("IncomeReport", incomeSchema)