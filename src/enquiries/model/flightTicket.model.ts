import * as mongoose from 'mongoose'


export interface FlightDocument extends mongoose.Document {
    flightID?: any;
    source?: string;
    studentId?: string,
    name?: string,
    country?: string;
    universityName?: string;
    //If Student request for the following
    passportNo?: string;
    expiryDate?: string;
    dob?: string;
    dial1?: string;
    primaryNumber?: string;
    dial2?: string;
    whatsAppNumber?: string;
    email?: string;
    //If Agent request for the following
    agentName?: string;
    studentName?: string;
    businessName?: string;
    dial3?: string;
    agentPrimaryNumber?: string;
    dial4?: string;
    agentWhatsAppNumber?: string;
    agentEmail?: string;
    from?: string;
    to?: string;
    dateOfTravel?: string;
    message?: string;
    adminId?: any;
    staffId?: any;
    status?: any;
    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const flightTicketSchema = new mongoose.Schema({
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin'},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    flightID: {type: String},
    source: {type: String},
    studentId: {type: String},
    name:{type:String},

    country: {type: String},
    universityName: {type: String},
    message: {type: String},
    //If Student request for the following
    passportNo: {type: String},
    expiryDate:{  type: String },
    dob: {type: String},
    dial1: {type: String},
    primaryNumber: {type: String},
    dial2: {type: String},
    whatsAppNumber: {type: String},
    email: {type: String},
    //If Agent request for the following
    agentName: {type: String},
    studentName: {type: String},
    businessName: {type: String},
    dial3: {type: String},
    agentPrimaryNumber: {type: String},
    dial4: {type: String},
    agentWhatsAppNumber: {type: String},
    agentEmail: {type: String},
    from: {type: String},
    to: {type: String},
    dateOfTravel: {type: String},

    status: [{
        _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
        newStatus: {type: String},
        commentBox: {type: String},
        duration: {type: String},
        progress: {type: String},
        document:  {type: String},
        delay: {type: String},
        tagPerson: {type: String},
        subject: {type: String},
        reply: [{
            replyMessage: {type: String},
            createdBy: { type: String },
    
        }]
    }],
 
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const Flight = mongoose.model("FlightTicket", flightTicketSchema)