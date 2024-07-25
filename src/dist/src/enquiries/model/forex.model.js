"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forex = void 0;
const mongoose = require("mongoose");
const forexSchema = new mongoose.Schema({
    forexID: { type: String },
    source: { type: String },
    studentId: { type: String },
    message: { type: String },
    //If Student request for the following
    studentName: { type: String },
    country: { type: String },
    currency: { type: String },
    flag: { type: String },
    universityName: { type: String },
    studentID: { type: String },
    passportNo: { type: String },
    primaryNumber: { type: String },
    whatsAppNumber: { type: String },
    email: { type: String },
    //If Agent request for the following
    agentName: { type: String },
    businessName: { type: String },
    agentPrimaryNumber: { type: String },
    agentWhatsAppNumber: { type: String },
    agentEmail: { type: String },
    paymentType: { type: String },
    amountInCurrency: { type: String },
    assignedTo: { type: String },
    // New added Fields
    expiryDate: { type: Date },
    courseType: { type: String },
    value: { type: String },
    markUp: { type: String },
    profit: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Forex = mongoose.model("Forex", forexSchema);
//# sourceMappingURL=forex.model.js.map