"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promotion = void 0;
const mongoose = require("mongoose");
const promotionSchema = new mongoose.Schema({
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
exports.Promotion = mongoose.model("Promotion", promotionSchema);
//# sourceMappingURL=promotion.model.js.map