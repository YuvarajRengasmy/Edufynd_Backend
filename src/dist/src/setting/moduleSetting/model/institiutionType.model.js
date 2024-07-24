"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionType = void 0;
const mongoose = require("mongoose");
const institutionTypeSchema = new mongoose.Schema({
    institutionType: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.InstitutionType = mongoose.model("InstitutionType", institutionTypeSchema);
//# sourceMappingURL=institiutionType.model.js.map