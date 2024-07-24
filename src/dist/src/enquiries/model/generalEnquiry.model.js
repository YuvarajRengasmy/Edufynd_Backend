"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralEnquiry = void 0;
const mongoose = require("mongoose");
const generalEnquirySchema = new mongoose.Schema({
    studentId: { type: String },
    country: { type: String },
    universityName: { type: String },
    name: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    message: { type: String },
    typeOfUser: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.GeneralEnquiry = mongoose.model("GeneralEnquiry", generalEnquirySchema);
//# sourceMappingURL=generalEnquiry.model.js.map