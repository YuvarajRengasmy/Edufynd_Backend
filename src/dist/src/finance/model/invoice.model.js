"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String },
    receiverId: { type: mongoose.Types.ObjectId, ref: 'ReceiverInvoice' },
    tax: { type: String },
    gst: { type: String },
    tds: { type: Number },
    clientName: { type: String },
    universityName: { type: String },
    applicationID: { type: mongoose.Types.ObjectId, ref: 'Applicant' },
    agentName: { type: String },
    commissionReceived: { type: Number },
    INRValue: { type: Number },
    amountPaid: { type: Number },
    totalInvoiceAmount: { type: Number },
    transactions: { type: Number },
    transactionsDate: { type: String },
    amount: { type: Number },
    paymentMethod: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Invoice = mongoose.model("Invoice", invoiceSchema);
//# sourceMappingURL=invoice.model.js.map