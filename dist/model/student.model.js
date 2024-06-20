"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose = __importStar(require("mongoose"));
;
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
    mobileNumber: { type: String },
    whatsAppNumber: { type: String },
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
    country: [{
            label: { type: String },
            value: { type: String }
        }],
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
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Student = mongoose.model("Student", studentSchema);
