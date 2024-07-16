import * as mongoose from 'mongoose'


export interface FlightDocument extends mongoose.Document {
    flightID?: any;
    source?: string;
   
    message?: string;
    //If Student request for the following
    studentName?: string;
    passportNo?: string;
    dob?: string;
    primaryNumber?: string;
    whatsAppNumber?: string;
    email?: string;
    //If Agent request for the following
    agentName?: string;
    businessName?: string;
    agentPrimaryNumber?: string;
    agentWhatsAppNumber?: string;
    agentEmail?: string;
    from?: string;
    to?: string;
    dateOfTravel?: string;
    message?: string;

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const flightTicketSchema = new mongoose.Schema({
    flightID: {type: String},
    source: {type: String},
    message: {type: String},
  
    //If Student request for the following
    studentName: {type: String},
    passportNo: {type: String},
    dob: {type: String},
    primaryNumber: {type: String},
    whatsAppNumber: {type: String},
    email: {type: String},
    //If Agent request for the following
    agentName: {type: String},
    businessName: {type: String},
    agentPrimaryNumber: {type: String},
    agentWhatsAppNumber: {type: String},
    agentEmail: {type: String},
    from: {type: String},
    to: {type: String},
    dateOfTravel: {type: String},
     message: {type: String},
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Flight = mongoose.model("FlightTicket", flightTicketSchema)