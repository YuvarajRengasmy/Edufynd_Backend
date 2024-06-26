"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdmin = void 0;
const mongoose = require("mongoose");
const superAdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: { type: String },
    email: { type: String },
    mobileNumber: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    adminId: { type: mongoose.Types.ObjectId, ref: 'Admin' },
    staffId: { type: mongoose.Types.ObjectId, ref: 'Staff' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
exports.default = exports.SuperAdmin;
//# sourceMappingURL=superAdmin.model.js.map