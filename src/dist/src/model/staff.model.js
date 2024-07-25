"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema({
    employeeID: { type: String },
    photo: { type: String },
    empName: { type: String },
    designation: { type: String },
    jobDescription: { type: String },
    reportingManager: { type: String },
    shiftTiming: { type: String }, // (Attendance to be calculated based on this)
    areTheyEligibleForCasualLeave: { type: String }, // – Yes/No (Yes – Casual to be considered | No – Casual leave restricted)
    doj: { type: String },
    dob: { type: String },
    address: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    emergencyContactNo: { type: Number },
    probationDuration: { type: String },
    salary: { type: String }, // (Break Up with deduction – Manual)        
    idCard: { type: String }, // – Yes / No (If ‘Yes’ card to be generated)
    manageApplications: { type: String }, // Yes/No    //If Yes, List Country & University The user can only handle applications of these universities and country
    activeInactive: { type: String }, // – User
    teamLead: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String }, //(To be assigned by Super Admin)
    // Newly added fields
    team: { type: String },
    staffList: [String],
    personalMail: { type: String },
    address2: { type: String },
    pin: { type: Number },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    status: { type: String },
    companyAssests: { type: String },
    mobileName: { type: String },
    brandName: { type: String },
    imei: { type: String },
    phoneNumber: { type: Number },
    laptopName: { type: String },
    brand: { type: String },
    modelName: { type: String },
    ipAddress: { type: String },
    userName: { type: String },
    loginPassword: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Staff = mongoose.model('Staff', staffSchema);
//# sourceMappingURL=staff.model.js.map