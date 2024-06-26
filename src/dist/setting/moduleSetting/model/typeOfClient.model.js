"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOfClient = void 0;
const mongoose = require("mongoose");
const typeOfClientSchema = new mongoose.Schema({
    typeOfClient: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.TypeOfClient = mongoose.model("TypeOfClient", typeOfClientSchema);
//# sourceMappingURL=typeOfClient.model.js.map