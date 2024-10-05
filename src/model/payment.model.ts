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

    order_amount?: number;
    order_currency?: string;
    order_id?: string;
    customer_details?: any;
    payment_status?: any;
    payment_link?: any;
    cashfree_response?: any;

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

    order_amount: { type: Number},
    order_currency: { type: String},
    order_id: { type: String},
    customer_details: {
        customer_id: { type: String},
        customer_phone: { type: String},
        customer_name: { type: String},
        customer_email: { type: String},
    },
    payment_status: { type: String }, // Example field for status from Cashfree
    payment_link: { type: String },   // Example field for payment link from Cashfree
    cashfree_response: { type: Object }, // Store the entire response if necessary
    
})

LoggingMiddleware(paymentSchema)
export const Payment = mongoose.model("Payment", paymentSchema)