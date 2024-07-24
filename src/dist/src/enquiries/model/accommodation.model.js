"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accommodation = void 0;
const mongoose = require("mongoose");
const accommodationSchema = new mongoose.Schema({
    accommodationID: { type: String },
    studentId: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    studentName: { type: String },
    passportNumber: { type: String },
    source: { type: String },
    message: { type: String },
    // If Agent request for the following (Auto Fetch User Detail)
    agentID: { type: String },
    agentName: { type: String },
    businessName: { type: String },
    agentPrimaryNumber: { type: String },
    agentWhatsAppNumber: { type: String },
    agentEmail: { type: String },
    // If Student request for the following
    primaryNumber: { type: String },
    whatsAppNumber: { type: String },
    email: { type: String },
    universityName: { type: String },
    holdingOfferFromTheUniversity: { type: String },
    locationWhereAccommodationIsRequired: { type: String },
    assignedTo: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Accommodation = mongoose.model("Accommodation", accommodationSchema);
//# sourceMappingURL=accommodation.model.js.map