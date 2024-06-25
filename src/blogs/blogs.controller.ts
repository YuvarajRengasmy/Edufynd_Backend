import { Blog, BlogDocument } from '../blogs/blogs.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";

var activity = "Country";



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
                    introduction:blogDetails.introduction,
                    content1:blogDetails.content1,
                    content2: blogDetails.content2,
                    content3: blogDetails.content3,
                    tags: blogDetails.tags,

                    modifiedOn:blogDetails.modifiedOn,
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
