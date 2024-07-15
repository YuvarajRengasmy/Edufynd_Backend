import * as mongoose from 'mongoose'

export interface StudentDocument extends mongoose.Document {
    _id?: any;
    studentCode?: string;
    superAdminId?: any;
    agentId?: any;
    source?: string[];
    name?: string;
    citizenship?: string;
    dob?: string;
    passportNo?: string;
    expiryDate?: Date;
    gender?: string;
    email?: string;
    primaryNumber?: number;  //a
    whatsAppNumber?: number; // a
    highestQualification?: string;
    degreeName?: string;
    percentage?: string;
    institution?: string;
    academicYear?: string;
    yearPassed?: string;
    workExperience?: string; // In years
    doHaveAnyEnglishLanguageTest?: string;
    englishTestType?: any[]; // Only EnglishLanguageTest is true
    testScore?: number; // Only EnglishLanguageTest is true
    dateOfTest?: Date; // Only EnglishLanguageTest is true
    doYouHaveTravelHistory?: string; // Only TravelHistory is true
    anyVisaRejections?: string; // Only VisaRejections is true
    visaReason?: string;
    travelReason?: string;
    country?: string;
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

    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;

};

const studentSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    studentCode: { type: String },
    source: { type: String },
    name: { type: String },
    passportNo: { type: String },
    expiryDate: { type: String },
    dob: { type: String },
    citizenship: { type: String },
    gender: { type: String, },
    email: { type: String },
    primaryNumber: { type: Number },
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
    country: [String],
    desiredUniversity: { type: String }, //(Optional)
    desiredCourse: { type: String }, //(Optional)
    workExperience: { type: String },
    anyVisaRejections: { type: String }, // (Yes/No) If ‘Yes’ state reason (Text Box)
    visaReason: { type: String },
    doYouHaveTravelHistory: { type: String }, // (Yes/No) If ‘Yes’ state reason (Text Box)
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

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


export const Student = mongoose.model("Student", studentSchema)