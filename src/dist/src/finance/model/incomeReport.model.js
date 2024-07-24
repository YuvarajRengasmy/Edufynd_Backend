"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Income = void 0;
const mongoose = require("mongoose");
const incomeSchema = new mongoose.Schema({
    incomeDate: { type: String },
    nameOfIncome: { type: String },
    receivedFrom: { type: String },
    incomeAmount: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Income = mongoose.model("Income", incomeSchema);
//# sourceMappingURL=incomeReport.model.js.map