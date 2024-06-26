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
    shiftTiming: { type: String }, // (Attendance to be calculated based on this)
    areTheyEligibleForCasualLeave: { type: String }, // – Yes/No (Yes – Casual to be considered | No – Casual leave restricted)
    doj: { type: String }, // (Date of Joining)
    dob: { type: String }, // (Date of Birth)
    address: { type: String },
    email: { type: String },
    mobileNumber: { type: String },
    emergencyContactNo: { type: String },
    probationDuration: { type: String },
    salary: { type: String }, // (Break Up with deduction – Manual)        
    idCard: { type: String }, // – Yes / No (If ‘Yes’ card to be generated)
    manageApplications: { type: String }, // Yes/No    //If Yes, List Country & University The user can only handle applications of these universities and country
    activeInactive: { type: String }, // – User
    teamLead: { type: String }, // – Select Employees and permission to be viewed.
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    privileges: { type: String }, //(To be assigned by Super Admin) 
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Staff = mongoose.model('Staff', staffSchema);
//# sourceMappingURL=staff.model.js.map