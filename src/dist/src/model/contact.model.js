"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    message: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Contact = mongoose.model("Contact", contactSchema);
//# sourceMappingURL=contact.model.js.map