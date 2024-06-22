"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = void 0;
const mongoose = require("mongoose");
const paymentMethodSchema = new mongoose.Schema({
    paymentMethod: { type: String, },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);
//# sourceMappingURL=paymentMethod.model.js.map