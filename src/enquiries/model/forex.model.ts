import * as mongoose from 'mongoose'

export interface ForexDocument extends mongoose.Document {
    forexID?: string;
    studentId?: string,
    source?: string
    agentName?: string;
    businessName?: string;
    agentEmail?: string;
    dial1?: string;
    agentPrimaryNumber?: string;
    dial2?: string;
    agentWhatsAppNumber?: string;
    studentName?: string;
    passportNo?: string;
    email?: string;
    dial3?: string;
    primaryNumber?: string;
    dial4?: string;
    whatsAppNumber?: string;
    universityName?: string;
    paymentType?: string;
    country?: string;
    currency?: string;
    assignedTo?: string;
    message?: string;
    studentID?: string;
    amountInCurrency?: string;
    flag?: string
// New added Fields
    expiryDate?: string;
    courseType?: string;
    value?: string;
    markUp?: string;
    profit?: string;

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

}


const forexSchema = new mongoose.Schema({
    forexID: {type: String},
    source: {type: String},
    studentId: {type: String},
    message: {type: String},
    //If Student request for the following
    studentName: {type: String},
    country: {type: String},
    currency: {type: String},
    flag: {type: String},
    universityName: {type: String},
    studentID: {type: String},
    passportNo: {type: String},
    dial1: {type: String},
    primaryNumber: {type: String},
    dial2: {type: String},
    whatsAppNumber: {type: String},
    email: {type: String},
    //If Agent request for the following
    agentName: {type: String},
    businessName: {type: String},
    dial3:{type: String},
    agentPrimaryNumber: {type: String},
    dial4:{type: String},
    agentWhatsAppNumber: {type: String},
    agentEmail: {type: String},
    paymentType: {type: String},
    amountInCurrency: {type: String},
    assignedTo: {type: String},
    // New added Fields
    expiryDate:{type: String},
    courseType: {type: String},
    value:{type: String},
    markUp: {type: String},
    profit: {type: String},

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Forex = mongoose.model("Forex", forexSchema)