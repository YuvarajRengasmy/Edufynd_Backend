import * as mongoose from 'mongoose'

export interface AccommodationDocument extends mongoose.Document {
    studentName?: string;
    passportNumber?: string;
    source?: string;
    // If Agent request for the following (Auto Fetch User Detail)
    agentID?: string;
    agentName?: string;
    businessName?: string;
    agentPrimaryNumber?: string;
    agentWhatsAppNumber?: string;
    agentEmail?: string;

    // If Student request for the following
    primaryNumber?: string;
    whatsAppNumber?: string;
    email?: string;
    UniversityName?: string;
    holdingOfferFromTheUniversity?: string;
    locationWhereAccommodationIsRequired?: string;
    assignedTo?: string;

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

}

const accommodationSchema = new mongoose.Schema({
    studentName: {type: String},
    passportNumber: {type: String},
    source: {type: String},
    // If Agent request for the following (Auto Fetch User Detail)
    agentID: {type: String},
    agentName: {type: String},
    businessName: {type: String},
    agentPrimaryNumber: {type: String},
    agentWhatsAppNumber: {type: String},
    agentEmail: {type: String},

    // If Student request for the following
    primaryNumber: {type: String},
    whatsAppNumber: {type: String},
    email: {type: String},
    UniversityName: {type: String},
    holdingOfferFromTheUniversity: {type: String},
    locationWhereAccommodationIsRequired: {type: String},
    assignedTo: {type: String},

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Accommodation = mongoose.model("Accommodation", accommodationSchema)