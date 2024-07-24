"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiverInvoice = void 0;
const mongoose = require("mongoose");
const receiverInvoiceSchema = new mongoose.Schema({
    senderId: { type: mongoose.Types.ObjectId, ref: "SenderInvoice" },
    receiverInvoiceNumber: { type: String },
    gst: { type: String },
    tds: { type: String },
    agentName: { type: String },
    applicationID: { type: mongoose.Types.ObjectId, ref: "Applicant" }, // (List only Application ID where commission received. These Application IDs should be of the Agent)
    universityName: { type: String, ref: "University" },
    commission: { type: Number, ref: "Program" },
    amountInCurrency: { type: Number },
    amountInINR: { type: Number },
    amountPaid: { type: Number },
    totalInvoiceAmount: { type: String },
    transactions: { type: String },
    transactionsDate: { type: String },
    paymentMethod: { type: String },
    amount: { type: Number },
    netInWords: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.ReceiverInvoice = mongoose.model("ReceiverInvoice", receiverInvoiceSchema);
//# sourceMappingURL=receiverInvoice.model.js.map