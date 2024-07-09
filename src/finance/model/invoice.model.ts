import * as mongoose from 'mongoose'


export interface ReceiverInvoiceDocument extends mongoose.Document {
    //Invoice (Tax value to be added)
    invoiceNumber?: string;
    tax?: string;
    gst?: string;
    tds?: string;
    applicationID?: any;
    universityName?: string;
    commission?: string;
    // Sender
    clientName?: string;
     INRValue?: number;
    // Receiver
    agentName?: string;
    amountPaid?: number;       // (To be calculated on the course fee after scholarship – auto fetch from Applicant, if on course fees | If partial fees, calculate on Paid Fees – auto fetch from Applicant)
    totalInvoiceAmount?: string;
    transactions?; string;       // (Add multiple)
    transactionsDate?: string;
    amount?: string;
    paymentMethod?: string;

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


//    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },