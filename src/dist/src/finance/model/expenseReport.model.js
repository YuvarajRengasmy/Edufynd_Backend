"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
    expenseDate: { type: String },
    nameOfExpense: { type: String },
    paidAgainst: { type: String },
    expenseAmount: { type: String },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Expense = mongoose.model('Expense', expenseSchema);
//# sourceMappingURL=expenseReport.model.js.map