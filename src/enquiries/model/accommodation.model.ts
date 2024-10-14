import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../../helper/commonResponseHandler'

export interface AccommodationDocument extends mongoose.Document {
    accommodationID?: any;
    studentName?: string;
    adminId?: any;
    staffId?: any;
    staffName?:string,
    name?: string;
    passportNumber?: string;
    expiryDate?: string;
    source?: string;
    studentId?: string,
    country?: string;
    state?: string;
    lga?: string;
    // If Agent request for the following (Auto Fetch User Detail)
    agentID?: string;
    agentName?: string;
    businessName?: string;
    dial1?: string;
    agentPrimaryNumber?: string;
    dial2?: string;
    agentWhatsAppNumber?: string;
    agentEmail?: string;
    message?: string;
    // If Student request for the following
    dial3?: string;
    primaryNumber?: string;
    dial4?: string;
    whatsAppNumber?: string;
    email?: string;
    universityName?: string;
    courseType?:string;
    final?: string;
    accommodationType?: string;
    assignedTo?: string;
    typeOfClient?: string;
    status?: any;
    isDeleted?: boolean;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

}

const accommodationSchema = new mongoose.Schema({
    accommodationID: {type: String},
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin'},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    name:{type:String},
    typeOfClient: { type: String },
    studentId: {type: String},
    country: {type: String},
    state:{type: String},
    lga: {type: String},
    studentName: {type: String},
    passportNumber: {type: String},
    expiryDate: {type: String},
    source: {type: String},
    message: {type: String},
    // If Agent request for the following (Auto Fetch User Detail)
    agentID: {type: String},
    agentName: {type: String},
    businessName: {type: String},
    dial1: {type: String},
    agentPrimaryNumber: {type: String},
    dial2:{type: String},
    agentWhatsAppNumber: {type: String},
    agentEmail: {type: String},
    // If Student request for the following
    dial3: {type: String},
    primaryNumber: {type: String},
    dial4: {type: String},
    whatsAppNumber: {type: String},
    email: {type: String},
    universityName: {type: String},
    courseType:{type: String},
    final: {type: String},
    accommodationType: {type: String},
    assignedTo: {type: String},
   
    staffName: { type: String},
    status: [{
        _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
        statusName: {type: String},
        commentBox: {type: String},
        duration: {type: String},
        position: {type: Number},
        document:  {type: String},
        delay: {type: String},
        tagPerson: {type: String},
        subject: {type: String},
        reply: [{replyMessage: {type: String}, createdBy: {type: String} }],
        uploadFile: [{fileName: { type: String}, uploadImage: { type: String} }]   ,
        estimateDate: {type: Date},
        actualDate: {type: Date},
        subCategory: [String],
        category: [String],
        progress: { type: Number }, 
        completed: {type: Boolean},
        createdBy: { type: String },
        createdOn: { type: Date, default: Date.now },  // Automatically set to current date/time
        modifiedOn: { type: Date},
        modifiedBy: { type: String },
    }],

    isDeleted: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

LoggingMiddleware(accommodationSchema)
export const Accommodation = mongoose.model("Accommodation", accommodationSchema)