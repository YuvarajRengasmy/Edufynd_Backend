import * as mongoose from 'mongoose'


export interface InvoiceDocument extends mongoose.Document{
//Invoice (Tax value to be added)
invoiceNumber?: string;
tax?: string; 
gst?: string;
tds?: string;
  // Receiver Name    // (To be generated as separate invoice where the invoice number will be ‘Invoice Number’/Agent Code)
agentName?: string;
applicationID?: any;  // (List only Application ID where commission received. These Application IDs should be of the Agent)
universityName?: string;     // (Auto fetch based on Application ID)
commission?: string;        // (Calculate based on Agent Payout)
amountPaid?: string;       // (To be calculated on the course fee after scholarship – auto fetch from Applicant, if on course fees | If partial fees, calculate on Paid Fees – auto fetch from Applicant)
totalInvoiceAmount?: string;      // (Net of ‘Amount – Sender’ and ‘Amount Paid – Receiver’)
transactions?; string;       // (Add multiple)
transactionsDate?: string;
amount?: string;
paymentMethod?: string;

createdOn?: Date;
createdBy?: string;
modifiedOn?: Date;
modifiedBy?: string;


}