import { Facebook,FaceBookDocument } from '../model/facebook.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import  axios  from 'axios'
import * as config from '../../config';


var activity = "Facebook";


export const getAllFacebook = async (req, res) => {
    try {
        const data = await Facebook.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Facebook', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Facebook', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleFacebook = async (req, res) => {
    try {
        const data = await Facebook.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Facebook', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetSingle-Facebook', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createFacebookk = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: FaceBookDocument = req.body;
            const createData = new Facebook(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Facebook', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Facebook', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Facebook', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateFacebook = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const facebookData: FaceBookDocument = req.body;
            let statusData = await Facebook.findByIdAndUpdate({ _id: facebookData._id }, {
                $set: {

                    message: facebookData.message,
                    
                  
                    modifiedOn: new Date(),
                    modifiedBy: facebookData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-Facebook', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Facebook', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Facebook', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteFacebook = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await Facebook.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Facebook', true, 200, data, 'Successfully Remove Facebook');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Facebook', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredFacebook = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.socialMedia) {
            andList.push({ socialMedia: req.body.socialMedia })
        }
        if (req.body.noOfLeads) {
            andList.push({ noOfLeads: req.body.noOfLeads })
        }
      
        if (req.body.noOfCampaigns) {
            andList.push({ noOfCampaigns: req.body.noOfCampaigns })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const socialMediaList = await Facebook.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const socialMediaCount = await Facebook.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Facebook', true, 200, { socialMediaList, socialMediaCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Facebook', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/////



export let createFacebookPost =  async (req, res) => {

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await axios.post(
            'https://graph.facebook.com/v16.0/me/feed',
            {
                message: message,
                access_token: config.SERVER.PAGE_ACCESS_TOKEN
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating Facebook post:', error.response.data);
        res.status(500).json({ error: 'Failed to create post' });
    }
}
