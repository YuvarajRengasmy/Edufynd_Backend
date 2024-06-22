"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema({
    employeeID: { type: mongoose.Types.ObjectId },
    photo: { type: String },
    empName: { type: String },
    designation: { type: String },
    jobDescription: { type: String },
    reportingManager: { type: String },
    shiftTiming: { type: String },
    areTheyEligibleForCasualLeave: { type: String },
    doj: { type: String },
    dob: { type: String },
    address: { type: String },
    email: { type: String },
    mobileNumber: { type: String },
    emergencyContactNo: { type: String },
    probationDuration: { type: String },
    salary: { type: String },
    idCard: { type: String },
    manageApplications: { type: String },
    activeInactive: { type: String },
    teamLead: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Staff = mongoose.model('Staff', staffSchema);
//# sourceMappingURL=staff.model.js.map