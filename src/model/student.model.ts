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
    dob?: string;
    citizenship?: string;
    gender?: string;
    email?: string;
    primaryNumber?: number;  //a
    whatsAppNumber?: number; // a
    highestQualification?: string;
    degreeName?: string;
    academicYear?: string;
    yearPassed?: string;
    institution?: string;
    percentage?: string;
    doHaveAnyEnglishLanguageTest?: string;
    englishTestType?: any[]; // Only EnglishLanguageTest is true
    testScore?: number; // Only EnglishLanguageTest is true
    dateOfTest?: Date; // Only EnglishLanguageTest is true
    country?: string;
    desiredUniversity?: string;
    desiredCourse?: string;
    workExperience?: string; // In years
    anyVisaRejections?: string; // Only VisaRejections is true
    visaReason?: string;
    doYouHaveTravelHistory?: string; // Only TravelHistory is true
    travelReason?: string;
    finance?: any[];
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
    mobileNumber: { type: Number },
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

    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})


export const Student = mongoose.model("Student", studentSchema)