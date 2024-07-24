"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applicant = void 0;
const mongoose = require("mongoose");
const applicantSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    applicationCode: { type: String },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    name: { type: String, ref: 'Student' },
    dob: { type: String, ref: 'Student' },
    passportNo: { type: String, ref: 'Student' },
    email: { type: String, ref: 'Student' },
    primaryNumber: { type: Number, ref: 'Student' },
    whatsAppNumber: { type: Number, ref: 'Student' },
    inTake: { type: String },
    universityName: { type: String, ref: 'University' },
    campus: { type: String },
    course: { type: String },
    courseFees: { type: Number }, // (Auto fetch from Program)
    anyVisaRejections: { type: String, ref: 'Student' },
    feesPaid: { type: String },
    assignTo: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Applicant = mongoose.model("Applicant", applicantSchema);
//# sourceMappingURL=application.model.js.map