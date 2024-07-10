import * as mongoose from 'mongoose'


export interface ReceiverInvoiceDocument extends mongoose.Document {
  //Invoice (Tax value to be added)
  receiverInvoiceNumber?: string;
  senderId?: any;
  tax?: string;
  gst?: string;
  tds?: string;
  // Receiver Name    // (To be generated as separate invoice where the invoice number will be ‘Invoice Number’/Agent Code)
  agentName?: string;
  applicationID?: any;  // (List only Application ID where commission received. These Application IDs should be of the Agent)
  universityName?: string;     // (Auto fetch based on Application ID)
  commission?: number;        // (Calculate based on Agent Payout)
  amountPaid?: number;       // (To be calculated on the course fee after scholarship – auto fetch from Applicant, if on course fees | If partial fees, calculate on Paid Fees – auto fetch from Applicant)
  totalInvoiceAmount?: string;      // (Net of ‘Amount – Sender’ and ‘Amount Paid – Receiver’)
  transactions?: string;       // (Add multiple)
  transactionsDate?: string;
  amount?: string;
  paymentMethod?: string;
  netInWords?: string;

  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;


}

const receiverInvoiceSchema = new mongoose.Schema({
  senderId: { type: mongoose.Types.ObjectId, ref: "SenderInvoice" },
  receiverInvoiceNumber: { type: String },
  gst: { type: String },
  tds: { type: String },
 
  agentName: { type: String },
  applicationID: { type: mongoose.Types.ObjectId, ref: "Applicant" },  // (List only Application ID where commission received. These Application IDs should be of the Agent)
  universityName: { type: String, ref: "University" },   
  commission: { type: Number, ref: "Program" },      
  amountPaid: { type: Number },       
  totalInvoiceAmount: { type: String },     
  transactions: { type: String },      
  transactionsDate: { type: String },
  amount: { type: String },
  paymentMethod: { type: String },
  netInWords: {type: String},


  createdOn: { type: Date },
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },

})

export const ReceiverInvoice = mongoose.model("ReceiverInvoice", receiverInvoiceSchema)