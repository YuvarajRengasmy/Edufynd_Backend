"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.saveBlog = exports.getSingleBlog = exports.getAllBlog = void 0;
const blogs_model_1 = require("../blogs/blogs.model");
const express_validator_1 = require("express-validator");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "Blog";
let getAllBlog = async (req, res, next) => {
    try {
        const data = await blogs_model_1.Blog.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'GetAll-Blog', true, 200, data, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'GetAll-Blog', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllBlog = getAllBlog;
let getSingleBlog = async (req, res, next) => {
    try {
        const blog = await blogs_model_1.Blog.findOne({ _id: req.query._id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-1', 'Get-Single-Blog', true, 200, blog, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Get-Single-Blog', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getSingleBlog = getSingleBlog;
let saveBlog = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const blogDetails = req.body;
            const createData = new blogs_model_1.Blog(blogDetails);
            let insertData = await createData.save();
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Save-Blog', true, 200, insertData, ErrorMessage_1.clientError.success.savedSuccessfully);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Blog', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Save-Blog', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.saveBlog = saveBlog;
let updateBlog = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const blogDetails = req.body;
            const updateData = await blogs_model_1.Blog.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    title: blogDetails.title,
                    slug: blogDetails.slug,
                    summary: blogDetails.summary,
                    keyWords: blogDetails.keyWords,
                    show: blogDetails.show,
                    hide: blogDetails.hide,
                    addToFeatured: blogDetails.addToFeatured,
                    addToBreaking: blogDetails.addToBreaking,
                    addToSlider: blogDetails.addToSlider,
                    addToRecommended: blogDetails.addToRecommended,
                    showOnlyToRegisteredUsers: blogDetails.showOnlyToRegisteredUsers,
                    tags: blogDetails.tags,
                    optionalURL: blogDetails.optionalURL,
                    content: blogDetails.content,
                    uploadImage: blogDetails.uploadImage,
                    addImageURL: blogDetails.addImageURL,
                    imageDescription: blogDetails.imageDescription,
                    uploadFiles: blogDetails.uploadFiles,
                    language: blogDetails.language,
                    category: blogDetails.category,
                    subCategory: blogDetails.subCategory,
                    schedulePost: blogDetails.schedulePost,
                    dateOfPublished: blogDetails.dateOfPublished,
                    modifiedOn: new Date(),
                    modifiedBy: blogDetails.modifiedBy,
                }
            });
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Update-Blog', true, 200, updateData, ErrorMessage_1.clientError.success.updateSuccess);
        }
        catch (err) {
            (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Blog', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
        }
    }
    else {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Update-Blog', false, 422, {}, ErrorMessage_1.errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};
exports.updateBlog = updateBlog;
let deleteBlog = async (req, res, next) => {
    try {
        let id = req.query._id;
        const country = await blogs_model_1.Blog.findByIdAndDelete({ _id: id });
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-2', 'Delete-Blog', true, 200, country, 'Successfully Remove Blog');
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, 'Level-3', 'Delete-Blog', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blogs.controller.js.map