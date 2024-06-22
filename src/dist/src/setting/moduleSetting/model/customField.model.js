"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomField = exports.customFieldSchema = void 0;
const mongoose = require("mongoose");
exports.customFieldSchema = new mongoose.Schema({
    customFieldFor: { type: String },
    fieldLabel: { type: String },
    defaultValue: { type: String },
    helpText: { type: String },
    fieldType: { type: String },
    thisFieldIsRequired: { type: String },
    showOnTable: { type: String },
    visibleForAdminOnly: { type: String },
    visibleForClient: { type: String },
    active: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.CustomField = mongoose.model('CustomField', exports.customFieldSchema);
//# sourceMappingURL=customField.model.js.map