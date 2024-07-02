import * as mongoose from 'mongoose'

export interface AgentDocument extends mongoose.Document {
  _id?: any;
  studentId?: any;
  agentCode?: string;
  agentName?: string;
  businessName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: String;
  email?: string;
  mobileNumber?: string;
  whatsAppNumber?: string;
// Bank Details
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  ifsc?: string;
  branch?: string;
  panNumberIndividual?: string;
  panNumberCompany?: string; // If applicable
  gstn?: string; // Optional
  inc?: string; // If applicable
  staffName?: string;
  staffContactNo?: string; // agentPayout?: string[]; // List of payouts
  agentsCommission?: number; // Will be calculated based on the University Commission & Agent Payout
  agentBusinessLogo?: string; // Optional
  countryInterested?: string[];
  resetOtp?: string;
  resetOtpExpires?: number;
  isDeleted?: boolean;
  privileges?: string;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;

};

// Two field can be disabled must be enabled
//•Agent ID (Auto Generated)
//  agentPayout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPayout' }],



const agentSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
  agentCode: { type: String },
  studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
  agentName: { type: String },
  businessName: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  addressLine3: { type: String },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  whatsAppNumber: { type: String },
  // Bank Details
  accountName: {type: String},
  accountNumber: {type: String},
  bankName: {type: String},
  ifsc: {type: String},
  branch: {type: String},
  panNumberIndividual: { type: String },
  panNumberCompany: { type: String },   //(if applicable)
  gstn: { type: String },
  inc: { type: String },  // (if applicable)
  staffName: { type: String },
  staffContactNo: { type: String },
  // agentPayout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPayout' }],//•Agent payout (List, Add, Edit, Delete)
  agentsCommission: { type: Number },  // (Will be calculated based on the University Commission & Agent Payout) Decimal value to the nearest – To be viewed only for agents
  agentBusinessLogo: { type: String },  // (Optional)
  countryInterested:[String],
  password: { type: String },
  confirmPassword: { type: String },

  resetOtp: { type: String },
  resetOtpExpires: { type: Number },

  isDeleted: { type: Boolean, default: false },
  privileges: { type: String },

  createdOn: { type: Date },
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
})


export const Agent = mongoose.model("Agent", agentSchema)