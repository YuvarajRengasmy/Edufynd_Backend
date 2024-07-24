"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessEnquiry = void 0;
const mongoose = require("mongoose");
const businessEnquirySchema = new mongoose.Schema({
    studentId: { type: String },
    country: { type: String },
    universityName: { type: String },
    name: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    message: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.BusinessEnquiry = mongoose.model("BusinessEnquiry", businessEnquirySchema);
//# sourceMappingURL=businessEnquiry.model.js.map