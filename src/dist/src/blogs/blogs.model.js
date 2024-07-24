"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: { type: String },
    slug: { type: String },
    summary: { type: String },
    keyWords: { type: String },
    show: { type: String },
    hide: { type: String },
    addToFeatured: { type: String },
    addToBreaking: { type: String },
    addToSlider: { type: String },
    addToRecommended: { type: String },
    showOnlyToRegisteredUsers: { type: String },
    tags: { type: String },
    optionalURL: { type: String },
    content: { type: String },
    uploadImage: { type: String },
    addImageURL: { type: String },
    imageDescription: { type: String },
    uploadFiles: { type: String },
    language: { type: String },
    category: { type: String },
    subCategory: { type: String },
    schedulePost: { type: String },
    dateOfPublished: { type: Date },
    createdOn: { type: Date, default: Date.now() },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});
exports.Blog = mongoose.model("Blog", blogSchema);
//# sourceMappingURL=blogs.model.js.map