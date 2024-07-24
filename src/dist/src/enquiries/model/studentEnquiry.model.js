"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnquiry = void 0;
const mongoose = require("mongoose");
;
const studentEnquirySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    studentCode: { type: String },
    studentId: { type: String },
    message: { type: String },
    source: { type: String },
    name: { type: String },
    dob: { type: Date },
    passportNo: { type: String },
    qualification: { type: String },
    whatsAppNumber: { type: String },
    primaryNumber: { type: String },
    email: { type: String },
    cgpa: { type: String },
    yearPassed: { type: String },
    desiredCountry: { type: String },
    desiredCourse: { type: String },
    doYouNeedSupportForLoan: { type: String },
    assignedTo: { type: String },
    // New Added Field
    gender: { type: String },
    citizenShip: { type: String },
    expiryDate: { type: Date },
    desiredUniversity: { type: String },
    doYouHoldAnyOtherOffer: { type: String },
    country: { type: String },
    universityName: { type: String },
    programName: { type: String },
    refereeName: { type: String },
    refereeContactNo: { type: Number },
    registerForIELTSClass: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.StudentEnquiry = mongoose.model("StudentEnquiry", studentEnquirySchema);
//# sourceMappingURL=studentEnquiry.model.js.map