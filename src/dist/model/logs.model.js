"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logs = void 0;
const mongoose = require("mongoose");
;
const logsSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    time: { type: Number },
    date: { type: Date },
    ipAddess: { type: String },
    statusCode: { type: Number },
    activity: { type: String },
    url: { type: String },
    description: { type: String },
    processStatus: { type: Boolean },
    method: { type: String },
    level: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Logs = mongoose.model("Logs", logsSchema);
//# sourceMappingURL=logs.model.js.map