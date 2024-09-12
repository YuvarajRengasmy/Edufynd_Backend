import * as mongoose from 'mongoose'


export interface BusinessEnquiryDocument extends mongoose.Document{
    studentId?: string,
    country?: string;
    universityName?: string;
    name?: string;
    email?: string;
    
    dial1?: string;
    mobileNumber?: number;  
    message?: string;
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
     adminId?: any;
     staffId?: any;
    

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const businessEnquirySchema = new mongoose.Schema({
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin'},
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff'},
    studentId: {type: String},
    country: {type: String},
    universityName: {type: String},
    name: {type: String},
    email: {type: String},
    dial1: {type: String},
    mobileNumber: {type: Number},
    message: {type: String},

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

    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const BusinessEnquiry = mongoose.model("BusinessEnquiry", businessEnquirySchema)