"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose = require("mongoose");
;
// Two field can be disabled must be enabled
//•Agent ID (Auto Generated)
//  agentPayout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPayout' }],
const agentSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    agentCode: { type: String },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentName: { type: String },
    businessName: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    addressLine3: { type: String },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    whatsAppNumber: { type: String },
    bankDetail: { type: String },
    panNumberIndividual: { type: String },
    panNumberCompany: { type: String }, //(if applicable)
    gstn: { type: String },
    inc: { type: String }, // (if applicable)
    staffName: { type: String },
    staffContactNo: { type: String },
    // agentPayout: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentPayout' }],//•Agent payout (List, Add, Edit, Delete)
    agentsCommission: { type: Number }, // (Will be calculated based on the University Commission & Agent Payout) Decimal value to the nearest – To be viewed only for agents
    agentBusinessLogo: { type: String }, // (Optional)
    countryInterested: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Agent = mongoose.model("Agent", agentSchema);
//# sourceMappingURL=agent.model.js.map