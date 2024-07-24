"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
    typeOfUser: { type: String },
    userName: { type: String },
    subject: { type: String },
    content: { type: String },
    uploadImage: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.Notification = mongoose.model("Notification", notificationSchema);
//# sourceMappingURL=notification.model.js.map