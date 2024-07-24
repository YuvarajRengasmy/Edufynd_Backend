"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flight = void 0;
const mongoose = require("mongoose");
const flightTicketSchema = new mongoose.Schema({
    flightID: { type: String },
    source: { type: String },
    studentId: { type: String },
    country: { type: String },
    universityName: { type: String },
    message: { type: String },
    //If Student request for the following
    studentName: { type: String },
    passportNo: { type: String },
    dob: { type: String },
    primaryNumber: { type: String },
    whatsAppNumber: { type: String },
    email: { type: String },
    //If Agent request for the following
    agentName: { type: String },
    businessName: { type: String },
    agentPrimaryNumber: { type: String },
    agentWhatsAppNumber: { type: String },
    agentEmail: { type: String },
    from: { type: String },
    to: { type: String },
    dateOfTravel: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Flight = mongoose.model("FlightTicket", flightTicketSchema);
//# sourceMappingURL=flightTicket.model.js.map