import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../../helper/commonResponseHandler'


export interface BusinessEnquiryDocument extends mongoose.Document{
    studentId?: string,
    country?: string;
    universityName?: string;
    name?: string;
    email?: string;
    staffName?:string,
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
     typeOfClient?: string;
     status?: any;
     isActive?: string;
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
    typeOfClient: { type: String },
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
     staffName: { type: String},
     isActive: {type: String,default: "InActive"},
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
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


LoggingMiddleware(businessEnquirySchema)
export const BusinessEnquiry = mongoose.model("BusinessEnquiry", businessEnquirySchema)