import * as mongoose from 'mongoose'
import {LoggingMiddleware} from '../helper/commonResponseHandler'

export interface StudentDocument extends mongoose.Document {
    _id?: any;
    studentCode?: string;
    adminId?: any;
    staffId?: any;
    staffName?: string;
    superAdminId?: any;
    source?: string;
    name?: string;
    citizenship?: string;
    dob?: string;
    passportNo?: string;
    expiryDate?: Date;
    gender?: string;
    email?: string;
    dial1?: string;
    primaryNumber?: number;
    dial2?: string;
    dial3?: string;   
    dial4?: string; 
    whatsAppNumber?: number; 
    highestQualification?: string;
    degreeName?: string;
    percentage?: string;
    institution?: string;
    academicYear?: string;
    yearPassed?: string;
    workExperience?: string;
    doHaveAnyEnglishLanguageTest?: string;
    englishTestType?: any[]; 
    testScore?: number; 
    dateOfTest?: Date; 
    doYouHaveTravelHistory?: string; 
    anyVisaRejections?: string; 
    visaReason?: string;
    travelReason?: string;
    desiredCountry?: string;
    desiredCourse?: string;
    finance?: any[];
    desiredUniversity?: string;
    password?: string;
    confirmPassword?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedIn?: string;
    photo?: string;
    resume?: string;
    passport?: string;
    sslc?: string;
    hsc?: string;
    degree?: any[];
    additional?: any[];
    resetOtp?: string;
    resetOtpExpires?: number;   
// Newly Added
    duration?: string;
    lastEmployeer?: string;
    lastDesignation?: string;
    date?: string;
    purpose?: string;
    countryName?: string;
    dateVisa?: string;
    purposeVisa?: string;
    countryNameVisa?: string;
    activeStatus?: string;
    role?: string;
    privileges?: any[];
    isDeleted?: boolean;
    isActive?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

};


const privilegeSchema = new mongoose.Schema({
    module: { type: String}, // e.g., 'University', 'Program', 'Client'
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    });

const studentSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    adminId: { type: mongoose.Types.ObjectId,ref:'Admin'},
    staffId: { type: mongoose.Types.ObjectId,ref:'Staff'},
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    staffName: { type: String},
    studentCode: { type: String },
    source: { type: String },
    name: { type: String },
    passportNo: { type: String },
    expiryDate: { type: String },
    dob: { type: String },
    citizenship: { type: String },
    gender: { type: String, },
    email: { type: String },
    dial1: {type: String},
    primaryNumber: { type: Number },
    dial2: {type: String},
    dial3: {type: String},
    dial4: {type: String},
    whatsAppNumber: { type: Number },
    highestQualification: { type: String },
    degreeName: { type: String, },
    academicYear: { type: String },
    yearPassed: { type: String },
    institution: { type: String },
    percentage: { type: String },
    doHaveAnyEnglishLanguageTest: { type: String },
    englishTestType: { type: String },
    testScore: { type: String },
    dateOfTest: { type: String },
    desiredCountry: [String],
    desiredUniversity: { type: String }, 
    desiredCourse: { type: String }, 
    workExperience: { type: String },
    anyVisaRejections: { type: String }, 
    visaReason: { type: String },
    doYouHaveTravelHistory: { type: String }, 
    travelReason: { type: String },
    finance: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    linkedIn: { type: String },
    // Profile
    photo: { type: String },
    resume: { type: String },
    passport: { type: String },
    sslc: { type: String },
    hsc: { type: String },
    degree: [String],
    additional: [String],
    resetOtp: { type: String },
    resetOtpExpires: { type: Number },
    // Newly Added
    duration: {type: String},
    lastEmployeer: {type: String},
    lastDesignation: {type: String},
    date: {type: String},
    purpose: {type: String},
    countryName: {type: String},
    dateVisa: {type: String},
    purposeVisa: {type: String},
    countryNameVisa: {type: String},
    activeStatus: {type: String},
    role: { type: String},
    privileges: [privilegeSchema],
    

    isDeleted: { type: Boolean, default: false },
    isActive: {type: String,default: "InActive"},
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

LoggingMiddleware(studentSchema)
export const Student = mongoose.model("Student", studentSchema)