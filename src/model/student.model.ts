import * as mongoose from 'mongoose'

export interface StudentDocument extends mongoose.Document {
    _id?: any;
    studentCode?: string;
    superAdminId?: any;
    agentId?: any;
    source?: string[];
    name?: string;
    passportNo?: string;
    expiryDate?: Date;
    dob?: Date;
    citizenship?: string;
    gender?:string;
    email?: string;
    contactNumber?: string;
    primaryNumber?: string;
    whatsAppNumber?: string; 
    highestQualification?: string;
    degreeName?: string;
    academicYear?: string;
    yearPassed?: number;
    institution?: string;
    percentage?: number;
    doHaveAnyEnglishLanguageTest?: string;
    englishTestType?: any[]; 
    testScore?: number; 
    dateOfTest?: Date; 
    country?: string;
    desiredUniversity?: string;
    desiredCourse?: string;
    workExperience?: number; 
    anyVisaRejections?: string; 
    visaReason?: string;
    doYouHaveTravelHistory?: string; 
    travelReason?: string;
    finance?: any[];
    password?: string;
    confirmPassword?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedIn?: string;
    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

};

const studentSchema =new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    studentCode : {type: String},
    source: { type: String},
    name: {type: String},
    passportNo: {type: String},
    expiryDate: {type: String},
    dob: {type: String},
    citizenship : {type: String},
    gender : {type: String,},
    email: {type: String},
    mobileNumber: {type: String},
    whatsAppNumber: {type: String},
    highestQualification :{type: String},
    degreeName: {type: String, },
    academicYear: {type: String },
    yearPassed: {type: String },
    institution: {type: String },
    percentage: {type: String },
    doHaveAnyEnglishLanguageTest: {type: String},
    englishTestType: { type: String},
    testScore: {type: String},
    dateOfTest: {type: String},
    country:{type:String}, 
    desiredUniversity:{type: String}, //(Optional)
    desiredCourse:{type: String}, //(Optional)
    workExperience: {type: String},
    anyVisaRejections:{type: String}, // (Yes/No) If ‘Yes’ state reason (Text Box)
    visaReason: {type: String},
    doYouHaveTravelHistory: {type: String}, // (Yes/No) If ‘Yes’ state reason (Text Box)
    travelReason: {type: String},
    finance:{type: String},
    password: {type: String},
    confirmPassword:  {type: String},
    twitter: {type: String},
    instagram: {type: String},
    facebook: {type: String},
    linkedIn: {type: String},
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


export const Student = mongoose.model("Student", studentSchema)