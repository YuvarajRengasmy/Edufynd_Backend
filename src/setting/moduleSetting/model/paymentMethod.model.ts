import * as mongoose from 'mongoose'


export interface PaymentMethodDocument extends mongoose.Document {
    paymentMethod?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const paymentMethodSchema = new mongoose.Schema({
    paymentMethod: { type: String, },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema)