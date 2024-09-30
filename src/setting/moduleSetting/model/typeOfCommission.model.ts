import * as mongoose from 'mongoose'


export interface TypeOfCommissionDocument extends mongoose.Document {
    commission?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const typeOfCommissionSchema = new mongoose.Schema({
    
    commission: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const CommissionType = mongoose.model("TypeOfCommission", typeOfCommissionSchema)