import * as mongoose from 'mongoose'



export interface PaymentDocument extends mongoose.Document {
    userId?: any;
    amount?: number;
    currency?: string;
    stripePaymentId?: string;
    status?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'usd' },
    stripePaymentId: { type: String },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


export const Payment = mongoose.model("Payment", paymentSchema)