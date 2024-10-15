import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../../helper/commonResponseHandler'

export interface GeneralEnquiryDocument extends mongoose.Document{
    studentId?: string,
    country?: string;
    universityName?: string;
    name?: string;
    email?: string;
    dial1?: string;
    mobileNumber?: number;   
    message?: string;
    typeOfUser?: string;
    staffName?:string;
     //Newly added 
     source?: string;
     studentName?: string;
     gender?: string;
     dob?: string;
     passportNo?: string;
     expiryDate?: string;
     cgpa?: string;
     yearPassed?: string;
     desiredCountry?: string;
     desiredCourse?: string,
     doYouNeedSupportForLoan?: string;
     dial2?: string;
     whatsAppNumber?: string;
     qualification?: string;
     assignedTo?: string;
     agentName?: string;
     businessName?: string;
     agentEmail?: string;
     dial3?: string;
     agentPrimaryNumber?: string;
     dial4?: string;
     agentWhatsAppNumber?: string;
     adminId?: any;
     staffId?: any;
     
     status?: any;
     isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const generalEnquirySchema = new mongoose.Schema({
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin'},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    staffName: {type: String},
    studentId: {type: String},
    country: {type: String},
    universityName: {type: String},
    name: {type: String},
    email: {type: String},
    dial1:{type: String},
    mobileNumber: {type: Number},
    message: {type: String},
    typeOfUser: {type: String},

    //Newly added 
    source: { type: String },
    studentName: { type: String },
    gender: { type: String },
    dob: { type: String },
    passportNo: { type: String },
    expiryDate:{  type: String },
    cgpa: {type: String},
    yearPassed: { type: String },
    desiredCountry: { type: String },
    desiredCourse: { type: String },
    doYouNeedSupportForLoan: { type: String },
    dial2:{type: String},
    whatsAppNumber: { type: String },
    qualification: { type: String },
    assignedTo: { type: String },
    agentName: { type: String },
    businessName: { type: String },
    agentEmail: { type: String },
    dial3:{type: String},
    agentPrimaryNumber: { type: String },
    dial4:{type: String},
    agentWhatsAppNumber: { type: String },

    status: [{
        _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
        statusName: {type: String},
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
    
        }],
        createdBy: { type: String },
        createdOn: { type: Date, default: Date.now },  // Automatically set to current date/time
        modifiedOn: { type: Date, default: Date.now }
    }],
   
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


LoggingMiddleware(generalEnquirySchema)
export const GeneralEnquiry = mongoose.model("GeneralEnquiry", generalEnquirySchema)