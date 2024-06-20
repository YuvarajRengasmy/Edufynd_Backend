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
exports.Staff = void 0;
const mongoose = __importStar(require("mongoose"));
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
