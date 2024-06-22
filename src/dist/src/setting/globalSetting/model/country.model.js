"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = exports.countrySchema = void 0;
const mongoose = require("mongoose");
exports.countrySchema = new mongoose.Schema({
    country: [String],
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Country = mongoose.model("Country", exports.countrySchema);
//# sourceMappingURL=country.model.js.map