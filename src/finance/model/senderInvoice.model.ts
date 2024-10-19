import { application } from 'express';
import * as mongoose from 'mongoose';
import { University } from 'src/model/university.model';

export interface SenderInvoiceDocument extends mongoose.Document {
  senderInvoiceNumber?: string;
  tax?: string; 
  gst?: string;
  tds?: string;
  clientName?: string;
  universityName?: string;
  applicationID?: string;
  currency?: string;
  commission?: number;
  amountReceivedInCurrency?: number;
  amountReceivedInINR?: number;

  // INRValue?: number;
  date?: Date;
  paymentMethod?: string;
  totalCourseFees: number;
  finalValue: number;
  application:[];

  fixedAmount?: number;
  courseFeesAmount?: number;
  paidFeesAmount?: number;
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
  clientName: { type: String,ref: "Client" },
  universityName: { type: String, ref: "University" },
  // applicationID: { type: mongoose.Types.ObjectId, ref: "Applicant" },
  currency: { type: String },
  commission: { type: Number },

  amountReceivedInCurrency: { type: Number },
  totalCourseFees:{type: Number},
  finalValue:{type: Number},
  amountReceivedInINR: { type: Number },
  application:[{applicationCode: {type: String},
    courseFeesAmount:{type: Number},
    course:{type: String}, 
    agentName:{type: String},
    agentsCommission:{type: Number},
    universityName:{type: String},
    commissionValue:{type: Number},
    presentValueInINR:{type: Number},
    amountReceivedInINR:{type: Number}}],
   
  // INRValue: { type: Number },
  applicationID: [String],
  date: { type: Date },
  paymentMethod: { type: String,ref: "University" },
  fixedAmount: { type: Number ,ref: "University"},
  courseFeesAmount: { type: Number, ref: "Applicant"},
  paidFeesAmount:  { type: Number, ref: "Applicant"},
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

export const SenderInvoice = mongoose.model("SenderInvoice", senderInvoiceSchema);
