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
// const countryItemSchema = new Schema({
//     _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Generate a unique ID for each country
//     name: { type: String, required: true }
//   });
//   // Define the main schema
//   const countrySchema = new Schema({
//     countries: [countryItemSchema]
//   });
exports.Country = mongoose.model("Country", exports.countrySchema);
//# sourceMappingURL=country.model.js.map