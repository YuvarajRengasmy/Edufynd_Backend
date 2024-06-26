"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.emailSchema = void 0;
const mongoose = require("mongoose");
exports.emailSchema = new mongoose.Schema({
    from: { type: String },
    to: { type: String },
    subject: { type: String },
    content: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Email = mongoose.model("Email", exports.emailSchema);
//# sourceMappingURL=email.model.js.map