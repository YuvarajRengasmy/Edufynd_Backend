import * as mongoose from 'mongoose'


export interface InvoiceDocument extends mongoose.Document {
    //Invoice (Tax value to be added)
    invoiceNumber?: string;
    tax?: string;
    gst?: string;
    tds?: string;

    clientName?: string;
    universityName?: string;
    applicationID?: any;
    agentName?: string;
    commission?: string;
    paymentMethod?: string; // (upi, bank)
    INRValue?: number;
     
    amountPaid?: number;       // (To be calculated on the course fee after scholarship – auto fetch from Applicant, if on course fees | If partial fees, calculate on Paid Fees – auto fetch from Applicant)
    totalInvoiceAmount?: string;
    transactions?: string;       // (Add multiple)
    transactionsDate?: string;
    amount?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


//    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String },
    tax: { type: String },
    gst: { type: String },
    tds: { type: String },
    clientName: {type: String},
    universityName: {type: String},
    applicationID: {type: mongoose.Types.ObjectId, ref: 'Applicant' },
    agentName: {type: String},
    commission: {type: String},



})