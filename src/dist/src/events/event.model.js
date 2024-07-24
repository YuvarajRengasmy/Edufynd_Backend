"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    typeOfUser: { type: String },
    userName: { type: String },
    eventTopic: { type: String },
    date: { type: Date },
    time: { type: String },
    venue: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.Event = mongoose.model("Event", eventSchema);
//# sourceMappingURL=event.model.js.map