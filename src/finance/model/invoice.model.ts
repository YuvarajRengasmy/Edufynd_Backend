import * as mongoose from 'mongoose'


export interface InvoiceDocument extends mongoose.Document {
    //Invoice (Tax value to be added)
    invoiceNumber?: string;
    receiverId?: any;
    tax?: string;
    gst?: string;
    tds?: number;

    clientName?: string;
    universityName?: string;
    applicationID?: any;
    agentName?: string;
    commissionReceived?: number;

    INRValue?: number;

    amountPaid?: number;       // (To be calculated on the course fee after scholarship – auto fetch from Applicant, if on course fees | If partial fees, calculate on Paid Fees – auto fetch from Applicant)
    totalInvoiceAmount?: number;
    transactions?: string;       // (Add multiple)
    transactionsDate?: string;
    amount?: number;
    paymentMethod?: string; // (upi, bank)

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String },
    receiverId: { type: mongoose.Types.ObjectId, ref: 'ReceiverInvoice' },
    tax: { type: String },
    gst: { type: String },
    tds: { type: Number },
    clientName: { type: String },
    universityName: { type: String },
    applicationID: { type: mongoose.Types.ObjectId, ref: 'Applicant' },
    agentName: { type: String },
    commissionReceived: { type: Number },
    INRValue: { type: Number },

    amountPaid: { type: Number },
    totalInvoiceAmount: { type: Number },
    transactions: { type: Number },
    transactionsDate: { type: String },
    amount: { type: Number },
    paymentMethod: { type: String },

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },


})

export const Invoice = mongoose.model("Invoice", invoiceSchema)