import * as mongoose from 'mongoose';

export interface SenderInvoiceDocument extends mongoose.Document {
  senderInvoiceNumber?: string;
  tax?: string; 
  gst?: string;
  tds?: string;
  businessName?: string;
  universityName?: string;
  applicationID?: string;
  currency?: string;
  commission?: number;
  amountToBeReceivedCurrency?: string;
  amountReceivedInINRAndCurrency?: string;
  // INRValue?: number;
  date?: Date;
  paymentMethod?: string;
  fixedAmount?: number;
  courseFeesAmount?: number;
  scholarshipAmount?: number;
  paidFeesPercentage?: number;
  courseFeesPercentage?: number;
  netAmount?: number;
  netInWords?: string;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}

const senderInvoiceSchema = new mongoose.Schema({
  senderInvoiceNumber: { type: String },
  tax: { type: String },
  gst: { type: String },
  tds: { type: String },
  businessName: { type: String,ref: "Client" },
  universityName: { type: String, ref: "University" },
  applicationID: { type: String, ref: "Applicant" },
  currency: { type: String },
  // commission: { type: Number },
  amountToBeReceivedCurrency: { type: String },
  amountReceivedInINRAndCurrency: { type: String },
  // INRValue: { type: Number },
  date: { type: Date },
  paymentMethod: { type: String,ref: "University" },
  fixedAmount: { type: Number ,ref: "University"},
  courseFeesAmount: { type: Number, ref: "Applicant"},
  scholarshipAmount: { type: Number },
  paidFeesPercentage: { type: Number,ref: "University" },
  courseFeesPercentage: { type: Number,ref: "University" },
  netAmount: { type: Number },
  netInWords: { type: String },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String }
});

export const SenderInvoice = mongoose.model<SenderInvoiceDocument>("SenderInvoice", senderInvoiceSchema);
