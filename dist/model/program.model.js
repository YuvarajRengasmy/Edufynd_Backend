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
exports.Program = void 0;
const mongoose = __importStar(require("mongoose"));
const programSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    appliedStudentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    universityId: { type: mongoose.Types.ObjectId, ref: 'University' },
    universityName: { type: String }, // (List Universities added)
    universityLogo: { type: String },
    country: { type: String },
    courseType: [String], // (List) Add, Delete, View, Edit
    programTitle: { type: String },
    applicationFee: { type: String },
    currency: { type: String },
    flag: { type: String },
    discountedValue: { type: String },
    campus: [String], //(Fetch campus details from ‘UNIVERSITY’ based on the university selected) / (Multiple Add) 
    courseFee: { type: String }, // (To be added for each campus)
    inTake: [String],
    duration: { type: String }, // (Month & Year in numbers like 1 - 12),
    englishlanguageTest: { type: String }, // (ELT) requirement – Yes/No (Text Box)
    textBox: { type: String },
    universityInterview: { type: String }, // – Yes/No
    greGmatRequirement: { type: String }, //(Yes/No) If yes mention score
    score: { type: String },
    academicRequirement: { type: String }, //(Text Box)
    commission: { type: String }, // (Edit only for the program)
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Program = mongoose.model("Program", programSchema);
