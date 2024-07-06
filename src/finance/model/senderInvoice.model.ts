import * as mongoose from 'mongoose'


export interface SenderInvoiceDocument extends mongoose.Document{
//Invoice (Tax value to be added)
senderInvoiceNumber?: string;
tax?: string; 
gst?: string;
tds?: string;
// Sender Name (To be generated as separate invoice where the invoice number will be ‘Invoice Number’/Client Code)
clientName?: string;
universityName?: string;
applicationID?: any;      // (List only those applied & received visa for this university)
currency?: string;    // (Auto Fetch from ‘University’)
commission?: number;   // (Auto fetch from ‘Program’)
amountToBeReceivedCurrency?: string;
amountReceivedInINRAndCurrency?: string;  // (To be entered manually)
INRValue?: number;    // (Amount received in Currency / Amount Received in INR
date?: string;

paymentMethod?: string;
fixedAmount?: number;
courseFeesAmount? : number;
scholarshipAmount?: number;
paidFeesAmount?: number;
netAmount?: number;
netInWords?: string;

createdOn?: Date;
createdBy?: string;
modifiedOn?: Date;
modifiedBy?: string;


}

const senderInvoiceSchema = new mongoose.Schema({
    //Invoice (Tax value to be added)
    senderInvoiceNumber: {type: String},
tax: {type: String},
gst: {type: String},
tds: {type: String},
// Sender Name (To be generated as separate invoice where the invoice number will be ‘Invoice Number’/Client Code)
clientName: {type: String},
universityName: {type: String, ref: "University"},
applicationID: {type: mongoose.Types.ObjectId, ref: "Applicant"},     // (List only those applied & received visa for this university)
currency: {type: String, ref: "University"},    // (Auto Fetch from ‘University’)
commission: {type: Number, ref: "Program"},  // (Auto fetch from ‘Program’)
amountToBeReceivedCurrency: {type: String},
amountReceivedInINRAndCurrency: {type: String},  // (To be entered manually)
INRValue: {type: Number},    // (Amount received in Currency / Amount Received in INR
date: {type: String},
netAmount: {type: Number},
netInWords : {type: String},

createdOn: { type: Date },
createdBy: { type: String },
modifiedOn: { type: Date },
modifiedBy: { type: String },

})


export const SenderInvoice = mongoose.model("SenderInvoice", senderInvoiceSchema)