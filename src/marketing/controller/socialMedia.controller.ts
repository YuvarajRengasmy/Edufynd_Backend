import { SocialMedia,SocialMediaDocument } from '../model/socialMedia.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "SocialMedia";


export const getAllSocialMedia = async (req, res) => {
    try {
        const data = await SocialMedia.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-SocialMedia', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-SocialMedia', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleSocialMedia = async (req, res) => {
    try {
        const data = await SocialMedia.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-SocialMedia', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetSingle-SocialMedia', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createSocialMedia = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: SocialMediaDocument = req.body;
            const createData = new SocialMedia(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-SocialMedia', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-SocialMedia', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-SocialMedia', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateSocialMedia = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const socialMediaData: SocialMediaDocument = req.body;
            let statusData = await SocialMedia.findByIdAndUpdate({ _id: socialMediaData._id }, {
                $set: {

                    socialMedia: socialMediaData.socialMedia,
                    noOfFollowers: socialMediaData.noOfFollowers,
                    noOfCampaigns: socialMediaData.noOfCampaigns,
                    noOfLeads: socialMediaData.noOfLeads,
                  
                    modifiedOn: new Date(),
                    modifiedBy: socialMediaData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-SocialMedia', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-SocialMedia', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-SocialMedia', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteSocialMedia = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await SocialMedia.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the SocialMedia', true, 200, data, 'Successfully Remove SocialMedia');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the SocialMedia', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredSocialMedia = async (req, res, next) => {
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

        const socialMediaList = await SocialMedia.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const socialMediaCount = await SocialMedia.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter SocialMedia', true, 200, { socialMediaList, socialMediaCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter SocialMedia', false, 500, {}, errorMessage.internalServer, err.message);
    }
};