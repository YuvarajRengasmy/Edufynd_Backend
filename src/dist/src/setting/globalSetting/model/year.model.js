"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Year = exports.yearSchema = void 0;
const mongoose = require("mongoose");
exports.yearSchema = new mongoose.Schema({
    year: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Year = mongoose.model("Year", exports.yearSchema);
//# sourceMappingURL=year.model.js.map