import * as mongoose from 'mongoose'

export interface ForexDocument extends mongoose.Document {
    forexID?: string;
    source?: string
    studentName?: string;
    country?: string;
    currency?: string;
  
    universityName?: string;
    studentID?: string;
    passportNo?: string;
    primaryNumber?: string;
    whatsAppNumber?: string;
    email?: string;
    agentName?: string;
    businessName?: string;
    agentPrimaryNumber?: string;
    agentWhatsAppNumber?: string;
    agentEmail?: string;
    paymentType?: string;
    amountInCurrency?: string;
    assignedTo?: string;
    flag?: string
    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

}


const forexSchema = new mongoose.Schema({
    forexID: {type: String},
    source: {type: String},
    //If Student request for the following
    studentName: {type: String},
    country: {type: String},
    currency: {type: String},
    flag: {type: String},
    universityName: {type: String},
    studentID: {type: String},
    passportNo: {type: String},
    primaryNumber: {type: String},
    whatsAppNumber: {type: String},
    email: {type: String},
    //If Agent request for the following
    agentName: {type: String},
    businessName: {type: String},
    agentPrimaryNumber: {type: String},
    agentWhatsAppNumber: {type: String},
    agentEmail: {type: String},
    paymentType: {type: String},
    amountInCurrency: {type: String},
    assignedTo: {type: String},

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Forex = mongoose.model("Forex", forexSchema)