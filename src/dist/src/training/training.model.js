"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Training = void 0;
const mongoose = require("mongoose");
const trainingSchema = new mongoose.Schema({
    requestTraining: { type: String },
    trainingTopic: { type: String },
    date: { type: Date },
    time: { type: String },
    typeOfUser: { type: String },
    usersName: { type: String },
    material: { type: String },
    name: { type: String },
    subject: { type: String },
    content: { type: String },
    uploadDocument: { type: String },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
});
exports.Training = mongoose.model("Training", trainingSchema);
//# sourceMappingURL=training.model.js.map