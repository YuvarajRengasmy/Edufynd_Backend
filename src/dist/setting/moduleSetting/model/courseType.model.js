"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseTypeList = void 0;
const mongoose = require("mongoose");
const courseTypeListSchema = new mongoose.Schema({
    courseType: { type: String }, // program module
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.CourseTypeList = mongoose.model("CourseType", courseTypeListSchema);
//# sourceMappingURL=courseType.model.js.map