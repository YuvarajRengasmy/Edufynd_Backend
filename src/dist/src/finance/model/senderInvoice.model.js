"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderInvoice = void 0;
const mongoose = require("mongoose");
const senderInvoiceSchema = new mongoose.Schema({
    senderInvoiceNumber: { type: String },
    tax: { type: String },
    gst: { type: String },
    tds: { type: String },
    businessName: { type: String, ref: "Client" },
    universityName: { type: String, ref: "University" },
    applicationID: { type: mongoose.Types.ObjectId, ref: "Applicant" },
    currency: { type: String },
    commission: { type: Number },
    amountReceivedInCurrency: { type: Number },
    amountReceivedInINR: { type: Number },
    // INRValue: { type: Number },
    date: { type: Date },
    paymentMethod: { type: String, ref: "University" },
    fixedAmount: { type: Number, ref: "University" },
    courseFeesAmount: { type: Number, ref: "Applicant" },
    paidFeesAmount: { type: Number, ref: "Applicant" },
    scholarshipAmount: { type: Number },
    paidFeesPercentage: { type: Number, ref: "University" },
    courseFeesPercentage: { type: Number, ref: "University" },
    netAmount: { type: Number },
    netInWords: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.SenderInvoice = mongoose.model("SenderInvoice", senderInvoiceSchema);
//# sourceMappingURL=senderInvoice.model.js.map