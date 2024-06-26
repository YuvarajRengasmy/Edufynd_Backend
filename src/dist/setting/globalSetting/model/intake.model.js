"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InTake = exports.inTakeSchema = void 0;
const mongoose = require("mongoose");
exports.inTakeSchema = new mongoose.Schema({
    intakeName: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.InTake = mongoose.model("InTake", exports.inTakeSchema);
//# sourceMappingURL=intake.model.js.map