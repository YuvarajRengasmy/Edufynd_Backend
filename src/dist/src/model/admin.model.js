"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    name: { type: String },
    adminCode: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    password: { type: String },
    confirmPassword: { type: String },
    role: { type: String },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    programId: { type: mongoose.Types.ObjectId, ref: 'Program' },
    resetOtp: { type: String },
    resetOtpExpires: { type: Number },
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Admin = mongoose.model("Admin", adminSchema);
//# sourceMappingURL=admin.model.js.map