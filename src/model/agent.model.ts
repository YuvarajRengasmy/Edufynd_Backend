import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'

export interface AgentDocument extends mongoose.Document {
  _id?: any;
  source?: string;
  adminId?: any;
  studentId?: any;
  agentCode?: string;
  agentName?: string;
  businessName?: string;
  email?: string;
  dial1?: string;
  mobileNumber?: number;
  dial2?: string;  
  whatsAppNumber?: number; 
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: String;
  //Business Details
  gstn?: string; 
  panNumberIndividual?: string;
  panNumberCompany?: string; 
  staffName?: string;
  dial3?: string;
  staffContactNo?: number;  
  // Bank Details
  accountName?: string;
  accountNumber?: number; 
  ifsc?: string;
  bankName?: string;
  agentsCommission?: number;
  branch?: string;
  // Extra Fields
  inc?: string; 
  agentBusinessLogo?: string; 
  countryInterested?: string[];
  password?: string;
  confirmPassword?: string;
  resetOtp?: string;
  resetOtpExpires?: number;
  isDeleted?: boolean;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
  // Newly Added Field
  businessWebsite?: string;
  pin?: number;
  city?: string;
  state?: string;
  country?: string;
  registrationNo?: string;
  dial4?: string;
  whatsApp?: number;
  accountType?: string;
  swift?: string;
  desiredCountry?: string;
  requireVisaFilingSupport?: string;
  visaCommission?: number;
  role?:string;
  privileges?: any[];
  activeStatus?: string;
 
};

const privilegeSchema = new mongoose.Schema({
  module: { type: String}, // e.g., 'University', 'Program', 'Client'
  add: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  view: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  });


const agentSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
  adminId: { type: mongoose.Types.ObjectId, ref:"Admin" },
  agentCode: { type: String },
  source: { type: String },
  studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
  agentName: { type: String },
  businessName: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  addressLine3: { type: String },
  email: { type: String },

  dial1: {type: String},
  mobileNumber: { type: Number },
  dial2: {type: String},
  whatsAppNumber: { type: Number },
  // Bank Details
  accountName: { type: String },
  accountNumber: { type: Number },
  bankName: { type: String },
  ifsc: { type: String },
  branch: { type: String },
  panNumberIndividual: { type: String },
  panNumberCompany: { type: String }, 
  gstn: { type: String },
  inc: { type: String }, 
  staffName: { type: String },
  dial3: {type: String},
  staffContactNo: { type: Number },
  agentsCommission: { type: Number },  
  agentBusinessLogo: { type: String },  
  countryInterested: [String],
  password: { type: String },
  confirmPassword: { type: String },
  resetOtp: { type: String },
  resetOtpExpires: { type: Number },
  isDeleted: { type: Boolean, default: false },
  // Newly Added Field
  businessWebsite: { type: String },
  pin: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  registrationNo: { type: String },
  dial4: {type: String},
  whatsApp: { type: Number },
  accountType: { type: String },
  swift: { type: String },
  desiredCountry: { type: String },
  requireVisaFilingSupport: { type: String },
  visaCommission: { type: Number },
  role: { type: String},
  privileges: [privilegeSchema],
  activeStatus: {type: String},
  createdOn: { type: Date, default: Date.now()},
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
})

LoggingMiddleware(agentSchema)
export const Agent = mongoose.model("Agent", agentSchema)