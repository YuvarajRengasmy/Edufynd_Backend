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
exports.University = void 0;
const mongoose = __importStar(require("mongoose"));
const universitySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    universityName: { type: String },
    courseType: [String],
    email: { type: String },
    country: { type: String },
    countryName: { type: String },
    flag: { type: String },
    state: [String],
    lga: [String],
    ranking: { type: String },
    averageFees: { type: String },
    popularCategories: [String],
    admissionRequirement: { type: String },
    offerTAT: { type: String },
    paymentMethod: { type: String, },
    amount: { type: String },
    percentage: { type: String },
    eligibilityForCommission: { type: String },
    currency: { type: String },
    paymentTAT: { type: String },
    tax: { type: String },
    commissionPaidOn: { type: String },
    founded: { type: String },
    institutionType: { type: String },
    applicationFees: { type: String },
    costOfLiving: { type: String },
    grossTuition: { type: String },
    businessName: { type: String }, // Client Name
    banner: { type: String },
    universityLogo: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
// // Add a virtual property for createdOn in IST
// universitySchema.virtual('createdOnIST').get(function() {
//     if (this.createdOn) {
//         return moment(this.createdOn).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
//     }
//     return null;
// });
// // Ensure virtual fields are included in toJSON and toObject output
// universitySchema.set('toJSON', { virtuals: true });
// universitySchema.set('toObject', { virtuals: true });
exports.University = mongoose.model("University", universitySchema);
