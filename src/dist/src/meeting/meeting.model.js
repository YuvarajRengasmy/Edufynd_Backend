"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meeting = void 0;
const mongoose = require("mongoose");
const meetingSchema = new mongoose.Schema({
    hostName: { type: String },
    attendees: { type: String },
    subject: { type: String },
    content: { type: String },
    date: { type: Date },
    time: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.Meeting = mongoose.model("Meeting", meetingSchema);
//# sourceMappingURL=meeting.model.js.map