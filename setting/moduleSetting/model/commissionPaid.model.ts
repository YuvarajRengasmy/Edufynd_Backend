import * as mongoose from 'mongoose'


export interface CommissionPaidDocument extends mongoose.Document {
   
    commissionPaidOn?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const commissionPaidSchema = new mongoose.Schema({
    
    commissionPaidOn: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const CommissionPaid = mongoose.model("CommissionPaid", commissionPaidSchema)