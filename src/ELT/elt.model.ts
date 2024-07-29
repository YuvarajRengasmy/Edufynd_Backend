import * as mongoose from 'mongoose'


export interface ELTDocument extends mongoose.Document {
    studentName?: string;
    testName?: string;
    date?: Date;
    time?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const eltSchema = new mongoose.Schema({
    studentName: {type: String},
    testName: {type: String},
    date: {type: Date},
    time: {type: String},

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const ELT = mongoose.model("ELT", eltSchema)