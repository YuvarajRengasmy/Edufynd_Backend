import * as mongoose from 'mongoose'

export interface StudentEnquiryDocument extends mongoose.Document {
    _id?: any;
    studentCode?: string;
    source?: string;
    name?: string;
    dob?: string;
    passportNo?: string;
    qualification?: string;
    whatsAppNumber?: string; 
    primaryNumber?: string;
    email?: string;
    cgpa?: string;
    yearPassed?: string;
    desiredCountry?: string;
    desiredCourse?: string;
    doYouNeedSupportForLoan?: string;
    assignedTo?: string;

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

};

const studentEnquirySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    studentCode: {type: String},
    source: {type: String},
    name: {type: String},
    dob: {type: Date},
    passportNo: {type: String},
    qualification: {type: String},
    whatsAppNumber: {type: String},
    primaryNumber: {type: String},
    email: {type: String},
    cgpa: {type: String},
    yearPassed:  {type: String},
    desiredCountry: {type: String},
    desiredCourse: {type: String},
    doYouNeedSupportForLoan: {type: String},
    assignedTo: {type: String},

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


export const StudentEnquiry = mongoose.model("StudentEnquiry", studentEnquirySchema)