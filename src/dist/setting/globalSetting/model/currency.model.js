"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = exports.currencySchema = void 0;
const mongoose = require("mongoose");
exports.currencySchema = new mongoose.Schema({
    country: { type: String },
    currency: { type: String },
    flag: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Currency = mongoose.model("Currency", exports.currencySchema);
//# sourceMappingURL=currency.model.js.map