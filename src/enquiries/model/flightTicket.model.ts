import * as mongoose from 'mongoose'


export interface FlightDocument extends mongoose.Document {
    source?: string;
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


}