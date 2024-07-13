import * as mongoose from 'mongoose'

export interface AgentDocument extends mongoose.Document {
  _id?: any;
  studentId?: any;
  agentCode?: string;
  agentName?: string;
  source?: string;
  businessName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: String;
  email?: string;
  mobileNumber?: number;  //a
  whatsAppNumber?: number; //a
// Bank Details
  accountName?: string;
  accountNumber?: number;  //a
  bankName?: string;
  ifsc?: string;
  branch?: string;
  panNumberIndividual?: string;
  panNumberCompany?: string; // If applicable
  gstn?: string; // Optional
  inc?: string; // If applicable
  staffName?: string;
  staffContactNo?: number; //a       // agentPayout?: string[]; // List of payouts
  agentsCommission?: number;        // Will be calculated based on the University Commission & Agent Payout
  agentBusinessLogo?: string; // Optional
  countryInterested?: string[];
  resetOtp?: string;
  resetOtpExpires?: string;  //a
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
  source: {type: String},
  studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
  agentName: { type: String },
  businessName: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  addressLine3: { type: String },
  email: { type: String },
  mobileNumber: { type: Number},
  whatsAppNumber: { type: Number },
  // Bank Details
  accountName: {type: String},
  accountNumber: {type: Number},
  bankName: {type: String},
  ifsc: {type: String},
  branch: {type: String},
  panNumberIndividual: { type: String },
  panNumberCompany: { type: String },   //(if applicable)
  gstn: { type: String },
  inc: { type: String },  // (if applicable)
  staffName: { type: String },
  staffContactNo: { type: Number },
  // agentPayout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPayout' }],//•Agent payout (List, Add, Edit, Delete)
  agentsCommission: { type: Number },  // (Will be calculated based on the University Commission & Agent Payout) Decimal value to the nearest – To be viewed only for agents
  agentBusinessLogo: { type: String },  // (Optional)
  countryInterested: [String],
  password: { type: String },
  confirmPassword: { type: String },

  resetOtp: { type: String },
  resetOtpExpires: { type: String },

  isDeleted: { type: Boolean, default: false },
  privileges: { type: String },

  createdOn: { type: Date },
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
})


export const Agent = mongoose.model("Agent", agentSchema)