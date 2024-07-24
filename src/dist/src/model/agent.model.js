"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose = require("mongoose");
;
const agentSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    agentCode: { type: String },
    source: { type: String },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentName: { type: String },
    businessName: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    addressLine3: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    whatsAppNumber: { type: Number },
    // Bank Details
    accountName: { type: String },
    accountNumber: { type: Number },
    bankName: { type: String },
    ifsc: { type: String },
    branch: { type: String },
    panNumberIndividual: { type: String },
    panNumberCompany: { type: String }, //(if applicable)
    gstn: { type: String },
    inc: { type: String }, // (if applicable)
    staffName: { type: String },
    staffContactNo: { type: Number },
    // agentPayout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPayout' }],//•Agent payout (List, Add, Edit, Delete)
    agentsCommission: { type: Number }, // (Will be calculated based on the University Commission & Agent Payout) Decimal value to the nearest – To be viewed only for agents
    agentBusinessLogo: { type: String }, // (Optional)
    countryInterested: [String],
    password: { type: String },
    confirmPassword: { type: String },
    resetOtp: { type: String },
    resetOtpExpires: { type: Number },
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    // Newly Added Field
    businessWebsite: { type: String },
    pin: { type: Number },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    registrationNo: { type: String },
    whatsApp: { type: Number },
    accountType: { type: String },
    swift: { type: String },
    desiredCountry: { type: String },
    requireVisaFilingSupport: { type: String },
    visaCommission: { type: Number },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Agent = mongoose.model("Agent", agentSchema);
//# sourceMappingURL=agent.model.js.map