import * as mongoose from 'mongoose'


export interface TypeOfCommissionDocument extends mongoose.Document {
    commissionValue: string,
    paymentType: string,
    paymentStatus: string,
    paymentValue1: string,
    paymentStatus1: string,
    paymentValue2: string,
    paymentStatus2: string,
    paymentValue3: string,
    paymentStatus3: string,
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const typeOfCommissionSchema = new mongoose.Schema({
    
    commissionValue: { type: String },
    paymentType: { type: String },
    paymentStatus: { type: String },
    paymentValue1: { type: String },
    paymentStatus1: { type: String },
    paymentValue2: { type: String },
    paymentStatus2:  { type: String },
    paymentValue3:  { type: String },
    paymentStatus3:  { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const CommissionType = mongoose.model("TypeOfCommission", typeOfCommissionSchema)