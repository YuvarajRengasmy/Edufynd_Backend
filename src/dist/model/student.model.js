"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose = require("mongoose");
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
//# sourceMappingURL=student.model.js.map