"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.University = void 0;
const mongoose = require("mongoose");
const universitySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    universityCode: { type: String },
    superAdminId: { type: mongoose.Types.ObjectId, ref: 'SuperAdmin' },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    // clientId: { type: mongoose.Types.ObjectId, ref: 'Client', required: true },
    universityName: { type: String },
    about: { type: String },
    courseType: [String],
    email: { type: String },
    countryName: { type: String },
    flag: { type: String },
    country: { type: String },
    campuses: [{
            state: { type: String },
            cities: [String],
        }],
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
    courseFeesPercentage: { type: Number },
    paidFeesPercentage: { type: Number },
    founded: { type: String },
    institutionType: { type: String },
    businessName: { type: String }, // Client Name
    banner: { type: String },
    universityLogo: { type: String },
    website: { type: String },
    inTake: [String],
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    // applicationFees: { type: String },
    // costOfLiving: { type: String },
    // grossTuition: { type: String },
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
//# sourceMappingURL=university.model.js.map