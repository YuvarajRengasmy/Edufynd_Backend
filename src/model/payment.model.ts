import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'



export interface PaymentDocument extends mongoose.Document {
    studentId?: any;
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
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    amount: { type: Number},
    currency: { type: String, required: true, default: 'usd' },
    stripePaymentId: { type: String },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

LoggingMiddleware(paymentSchema)
export const Payment = mongoose.model("Payment", paymentSchema)