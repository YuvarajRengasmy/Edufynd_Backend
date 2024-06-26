"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
const mongoose = require("mongoose");
const countrySchema = new mongoose.Schema({
    country: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Country = mongoose.model("CountryName", countrySchema);
//# sourceMappingURL=country.model.js.map