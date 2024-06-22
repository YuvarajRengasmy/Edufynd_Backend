"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    clientID: { type: String },
    typeOfClient: { type: String },
    businessName: { type: String },
    clientStatus: { type: String },
    businessMailID: { type: String },
    businessContactNo: { type: String },
    website: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    addressLine3: { type: String },
    name: { type: String },
    contactNo: { type: String },
    emailID: { type: String },
    gstn: { type: String },
    staffStatus: { type: String },
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Client = mongoose.model("Client", clientSchema);
//# sourceMappingURL=client.model.js.map