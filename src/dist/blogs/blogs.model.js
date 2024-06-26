"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: { type: String },
    introduction: { type: String },
    content1: { type: String },
    content2: { type: String },
    content3: { type: String },
    tags: [String],
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Blog = mongoose.model("Blog", blogSchema);
//# sourceMappingURL=blogs.model.js.map