"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionPaid = void 0;
const mongoose = require("mongoose");
const commissionPaidSchema = new mongoose.Schema({
    commissionPaidOn: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.CommissionPaid = mongoose.model("CommissionPaid", commissionPaidSchema);
//# sourceMappingURL=commissionPaid.model.js.map