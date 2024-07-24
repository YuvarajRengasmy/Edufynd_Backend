"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.statusSchema = void 0;
const mongoose = require("mongoose");
exports.statusSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    statusName: { type: String },
    duration: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Status = mongoose.model("Status", exports.statusSchema);
//# sourceMappingURL=status.model.js.map