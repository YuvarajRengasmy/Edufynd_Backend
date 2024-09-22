import { Blog, BlogDocument } from '../blogs/blogs.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";

var activity = "Blog";



export let getAllBlog = async (req, res, next) => {
    try {
        const data = await Blog.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Blog', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Blog', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Blog', true, 200, blog, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Blog', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



export let saveBlog = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const blogDetails: BlogDocument = req.body;
            const createData = new Blog(blogDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-Blog', true, 200, insertData , clientError.success.savedSuccessfully);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Blog', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Blog', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateBlog = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
            const blogDetails : BlogDocument = req.body;
            const updateData = await Blog.findOneAndUpdate({ _id: req.body._id }, {
                $set: {  
                    title: blogDetails.title,
                    slug: blogDetails.slug,
                    summary: blogDetails.summary,
                    keyWords: blogDetails.keyWords,
                    show: blogDetails.show,
                    hide: blogDetails.hide,
                    addToFeatured: blogDetails.addToFeatured,
                    addToBreaking:blogDetails.addToBreaking,
                    addToSlider: blogDetails.addToSlider,
                    addToRecommended:blogDetails.addToRecommended,
                    showOnlyToRegisteredUsers: blogDetails.showOnlyToRegisteredUsers,
                    tags:blogDetails.tags,
                    optionalURL: blogDetails.optionalURL,
                    content:blogDetails.content,
                    uploadImage: blogDetails.uploadImage,
                    addImageURL: blogDetails.addImageURL,
                    imageDescription: blogDetails.imageDescription,
                    uploadFiles: blogDetails.uploadFiles,
                    uploadFile: blogDetails.uploadFile,
                    language:blogDetails.language,
                    category:blogDetails.category,
                    subCategory: blogDetails.subCategory,
                    schedulePost:blogDetails.schedulePost,
                    dateOfPublished: blogDetails.dateOfPublished,
                  

                    modifiedOn: new Date(),
                    modifiedBy:blogDetails.modifiedBy,
                }
                
            });
            response(req, res, activity, 'Level-2', 'Update-Blog', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Blog', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Blog', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteBlog = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const country = await Blog.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Delete-Blog', true, 200, country, 'Successfully Remove Blog');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Blog', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredBlog = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.title) {
            andList.push({ title: req.body.title })
        }
        if (req.body.slug) {
            andList.push({ slug: req.body.slug })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        if (req.body.dateOfPublished) {
            andList.push({ dateOfPublished: req.body.dateOfPublished })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const blogList = await Blog.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)

        const blogCount = await Blog.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Blog', true, 200, { blogList, blogCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Blog', false, 500, {}, errorMessage.internalServer, err.message);
    }
};