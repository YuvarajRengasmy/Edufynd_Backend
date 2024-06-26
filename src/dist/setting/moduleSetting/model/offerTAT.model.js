"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferTAT = void 0;
const mongoose = require("mongoose");
const OfferTATSchema = new mongoose.Schema({
    offerTAT: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.OfferTAT = mongoose.model("OfferTAT", OfferTATSchema);
//# sourceMappingURL=offerTAT.model.js.map