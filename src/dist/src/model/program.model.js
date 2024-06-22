"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const mongoose = require("mongoose");
const programSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    appliedStudentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    universityName: { type: String },
    universityLogo: { type: String },
    country: { type: String },
    courseType: [String],
    programTitle: { type: String },
    applicationFee: { type: String },
    currency: { type: String },
    flag: { type: String },
    discountedValue: { type: String },
    campus: [String],
    courseFee: { type: String },
    inTake: [String],
    duration: { type: String },
    englishlanguageTest: { type: String },
    textBox: { type: String },
    universityInterview: { type: String },
    greGmatRequirement: { type: String },
    score: { type: String },
    academicRequirement: { type: String },
    commission: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Program = mongoose.model("Program", programSchema);
//# sourceMappingURL=program.model.js.map