import * as mongoose from 'mongoose'


export interface ReceiverInvoiceDocument extends mongoose.Document {
  //Invoice (Tax value to be added)
  receiverInvoiceNumber?: string;
  senderId?: any;
  tax?: string;
  gst?: string;
  tds?: string;
  // Receiver Name    
  agentName?: string;
  applicationID?: any;  
  universityName?: string;   
  commission?: number;      
  amountInCurrency?: number;
  amountInINR?: number;
  amountPaid?: number;       
  totalInvoiceAmount?: string;   
  transactions?: string;      
  transactionsDate?: string;
  amount?: number;
  paymentMethod?: string;
  netInWords?: string;
  agentCommissionValue:string;
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
  agentCommissionValue: { type: Number },
  applicationID: { type: mongoose.Types.ObjectId, ref: "Applicant" },  
  universityName: { type: String, ref: "University" },   
  commission: { type: Number, ref: "Program" },
  amountInCurrency: { type: Number },
  amountInINR: { type: Number },      
  amountPaid: { type: Number },       
  totalInvoiceAmount: { type: String },     
  transactions: { type: String },      
  transactionsDate: { type: String },
  paymentMethod: { type: String },
  amount: { type: Number },
  netInWords: {type: String},
  application: [{ 
    course: {type: String},
     applicationCode: {type: String},
     universityName: {type: String},
      courseFeesAmount:{type: Number}, 
      amountReceived: {type: Number},
      dayInInr: {type: Number},
      totalAmount:{type: Number} }],

  createdOn: { type: Date, default: Date.now },
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },

})

export const ReceiverInvoice = mongoose.model("ReceiverInvoice", receiverInvoiceSchema)