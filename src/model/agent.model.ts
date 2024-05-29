import * as mongoose from 'mongoose'

export interface AgentDocument extends mongoose.Document {
    
    // agentId?: string; // Auto Generated
    _id?: any;
    businessName?: string;
    address?:any;
    email?: string;
    // contactNumber?: string;
    mobileNumber?: string;
    whatsAppNumber?: string;
    bankDetail?: string;
    panNumberIndividual?: string;
    panNumberCompany?: string; // If applicable
    gstn?: string; // Optional
    inc?: string; // If applicable
    staffDetail?: any;
    // agentPayout?: string[]; // List of payouts
    agentsCommission?: number; // Will be calculated based on the University Commission & Agent Payout
    agentBusinessLogo?: string; // Optional
    countryInterested?: string[];
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
     //•Agent ID (Auto Generated)
     _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
     name: { type: String},
     businessName: { type: String},
     address: [{ 
             streetAddress: { type: String },
             city: { type: String },
             state: { type: String },
             country: { type: String },
             pinCode: { type: String }
               }],
     email: { type: String, required: true},
     mobileNumber: {type: String, required: true},
    whatsAppNumber: {type: String},
     bankDetail: {type: String },
     panNumberIndividual: { type: String },
     panNumberCompany: { type: String},   //(if applicable)
     gstn: {type: String},
     inc: {type: String},  // (if applicable)
     staffDetail: [{
         name: { type: String },
         contactNumber: { type: String }
               }],
     // agentPayout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPayout' }],//•Agent payout (List, Add, Edit, Delete)
     agentsCommission: {type: Number},  // (Will be calculated based on the University Commission & Agent Payout) Decimal value to the nearest – To be viewed only for agents
     agentBusinessLogo: {type: String},  // (Optional)
     countryInterested: {type: String},
     password: {type: String},
     confirmPassword:  {type: String},
     isDeleted: { type: Boolean, default: false },
     privileges: {type: String},
   
     createdOn: { type: Date },
     createdBy: { type: String },
     modifiedOn: { type: Date },
     modifiedBy: { type: String },
})


export const Agent = mongoose.model("Agent", agentSchema)