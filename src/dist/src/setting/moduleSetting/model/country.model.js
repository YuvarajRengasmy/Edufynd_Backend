"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryList = void 0;
const mongoose = require("mongoose");
const countrySchema = new mongoose.Schema({
    name: { type: String },
    code: { type: String },
    state: [{
            name: { type: String }, // State Name
            cities: [String] // City Name
        }],
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
// export const Country = mongoose.model("CountryName", countrySchema)
exports.CountryList = mongoose.model("CountryList", countrySchema);
//# sourceMappingURL=country.model.js.map