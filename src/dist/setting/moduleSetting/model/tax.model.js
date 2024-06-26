"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tax = void 0;
const mongoose = require("mongoose");
const taxSchema = new mongoose.Schema({
    tax: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Tax = mongoose.model("Tax", taxSchema);
//# sourceMappingURL=tax.model.js.map