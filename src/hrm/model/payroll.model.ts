import * as mongoose from 'mongoose'

export interface PayRollDocument extends mongoose.Document {
    _id?: any;
    basicAllowance?: number;
    hra?: number;
    conveyance?: number;
    otherAllowance?: number;
    //Deduction
    pf?: number;
    taxDeduction?: number;
    performanceDeduction?: number;
    otherDeduction?: number;
    //Salary Details
    grossSalary?: number;
    totalDeduction?: number;
    netSalary?: number;
    uploadDocument?: string;
    netInWords?: string;
    allowance?: any[];
    deduction?: any[];
    payableDays?: number;
    lopDays?: number
  
    //staff Details
    empName?: string;
    staffId?: string;
    employeeId?: string;
    reportingManager?: string;
    photo?: string;
    email?: string;
    mobileNumber: number;
    designation: string;
    description: string;
    bankName?: string;
    bankAccountNo?: string;
    bankIFSC?: string;
    bankBranch?: string;
    pfAccountNo?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const payRollSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    basicAllowance: { type: Number },
    hra: { type: Number },
    conveyance: { type: Number },
    otherAllowance: { type: Number },
    //Deduction
    pf: { type: Number },
    taxDeduction: { type: Number },
    performanceDeduction: { type: Number },
    otherDeduction: { type: Number },
    //Salary Details
    grossSalary: { type: Number },
    totalDeduction: { type: Number },
    netSalary: { type: Number },
    uploadDocument: { type: String },
    netInWords: {type: String},
    allowance: [{
        name: {type: String},
        amount: {type:Number}
    }],
    deduction: [{
        title: {type: String},
        amount: {type:Number}
    }],
    payableDays: {type: Number},
    lopDays: {type: Number},
    //staff Details
    empName: { type: String },
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff' },
    employeeId: { type: String },
    reportingManager: { type: String },
    photo: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    designation: { type: String },
    description:{ type: String },
    bankName:{type: String},
    bankAccountNo:{type: String},
    bankIFSC:{type: String},
    bankBranch:{type: String},
    pfAccountNo:{type: String},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const PayRoll = mongoose.model("PayRoll", payRollSchema)