import * as mongoose from 'mongoose'

export interface PayRollDocument extends mongoose.Document {
    _id?: any;
    houseRent?: number;
    conveyance?: number;
    otherAllowance?: number;

    //Deduction
    pf?: number;
    taxDeduction?: number;

    //Salary Details
    grossSalary?: number;
    totalDeduction?: number;
    netSalary?: number;

    uploadDocument?: string;
   // additionalComponents?: any;


    allowance?: any;
    deduction?: any;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const payRollSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    houseRent: { type: Number },
    conveyance: { type: Number },
    otherAllowance: { type: Number },
    //Deduction
    pf: { type: Number },
    taxDeduction: { type: Number },
    //Salary Details
    grossSalary: { type: Number },
    totalDeduction: { type: Number },
    netSalary: { type: Number },
    uploadDocument: { type: String },
   // additionalComponents: { type: Map, of: mongoose.Schema.Types.Mixed }, // New field to store dynamic components and // Allows for both Number and String types

    allowance: [{
        name: {type: String},
        amount: {type:Number}
    }],

    deduction: [{
        title: {type: String},
        amount: {type:Number}
    }],

    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const PayRoll = mongoose.model("PayRoll", payRollSchema)