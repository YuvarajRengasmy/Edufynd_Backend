import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'



export interface PaymentDocument extends mongoose.Document {
    studentId?: any;
    studentName?: string;
    amount?: number;
    currency?: string;
    email?: string;
    stripePaymentId?: string;
    status?: string;
    whatsAppNumber?: string;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const paymentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    studentName: {type: String},
    amount: { type: Number},
    currency: { type: String, required: true, default: 'usd' },
    stripePaymentId: { type: String },
    email: {type: String},
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    isActive: {type: String,default: "InActive"},
    whatsAppNumber: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

LoggingMiddleware(paymentSchema)
export const Payment = mongoose.model("Payment", paymentSchema)