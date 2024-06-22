"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Types.ObjectId, required: true, auto: true },
    userId: { type: String },
    name: { type: String },
    role: { type: String },
    status: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.model.js.map