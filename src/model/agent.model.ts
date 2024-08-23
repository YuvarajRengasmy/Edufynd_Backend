import * as mongoose from 'mongoose'

export interface AgentDocument extends mongoose.Document {
  _id?: any;
  source?: string;
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
  privileges?: string;
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
  notificationId?: any;
 
};


const agentSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
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
  privileges: { type: String },
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
  notificationId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  createdOn: { type: Date, default: Date.now()},
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
})


export const Agent = mongoose.model("Agent", agentSchema)