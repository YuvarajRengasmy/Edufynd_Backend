import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'


export interface ApplicantDocument extends mongoose.Document {
    _id?: any;
    applicationCode?: string;
    programId?: any;
    adminId?: any;
    staffId?: any;
    staffName?: any;
    studentCode?: string;
    studentId?:string;
    name?: string,       
    dob?: string,           
    passportNo?: string,      
    email?: string, 
    dial1?: string;       
    primaryNumber?: number, 
    dial2?: string; 
    whatsAppNumber?: number,  
    inTake?: string,
    applicationFee?: number,
    country?: string;
    universityName?: string,
    course?: string,
    campus?: string,
    courseFees?: number,
    anyVisaRejections?: string, 
    feesPaid?: string,
    assignTo?: string,
    commentBox?: string;
    programTitle?: string;
    isDeleted?: boolean;
    isActive?: string;
    status?: any;
    uniCountry?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const applicantSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    applicationCode: { type: String },
    programId: { type: mongoose.Types.ObjectId, ref: 'Program' },
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin' },
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff' },
  
    staffName: { type: String},
    studentId: {type: String, ref: 'Student'},
    studentCode: { type: String },
    name: {type: String, ref: 'Student'},
    dob: { type: String, ref: 'Student' },
    passportNo: { type: String, ref: 'Student' },
    email: { type: String, ref: 'Student' },
    dial1: {type: String},
    applicationFee: { type: Number },
    primaryNumber: { type: Number, ref: 'Student' },
    dial2: {type: String},
    whatsAppNumber: { type: Number, ref: 'Student' },
    inTake: { type: String },
    country: {type: String},
    universityName: { type: String, ref: 'University' },
    campus: {type: String},
    course: { type: String },
    courseFees: { type: Number },       
    anyVisaRejections: { type: String, ref: 'Student' },
    feesPaid: { type: String },
    assignTo: { type: String },
    document:  {type: String},
    commentBox: {type: String},
    isDeleted: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
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
    
        }],
        subCategory: [String],
        completed: {type: Boolean},
        createdBy: { type: String },
        createdOn: { type: Date, default: Date.now },  // Automatically set to current date/time
        modifiedOn: { type: Date, default: Date.now }
    }],

    programTitle: {type: String},
    uniCountry: {type: String},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})


LoggingMiddleware(applicantSchema)
export const Applicant = mongoose.model("Applicant", applicantSchema)