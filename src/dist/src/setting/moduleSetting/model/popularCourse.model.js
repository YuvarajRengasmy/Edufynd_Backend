"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopularCategory = void 0;
const mongoose = require("mongoose");
const PopularCategorySchema = new mongoose.Schema({
    popularCategories: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.PopularCategory = mongoose.model("PopularCategory", PopularCategorySchema);
//# sourceMappingURL=popularCourse.model.js.map