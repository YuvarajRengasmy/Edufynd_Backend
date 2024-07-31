import { Campaign, CampaignDocument } from '../model/campaign.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Campaign";



export const getAllCampaign = async (req, res) => {
    try {
        const data = await Campaign.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Campaign', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Campaign', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCampaign = async (req, res) => {
    try {
        const data = await Campaign.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Campaign', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Campaign', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createCampaign = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: CampaignDocument = req.body;
            const createData = new Campaign(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Campaign', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Campaign', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Campaign', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateCampaign = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const campaignData: CampaignDocument = req.body;
            let statusData = await Campaign.findByIdAndUpdate({ _id: campaignData._id }, {
                $set: {

                    platformName: campaignData.platformName,
                    campaignName: campaignData.campaignName,
                    budgetRequested: campaignData.budgetRequested,
                    budgetAlloted: campaignData.budgetAlloted,
                    budgetSpent: campaignData.budgetSpent,
                    time: campaignData.time,
                    leadsGenerated: campaignData.leadsGenerated,
                    leadsConverted: campaignData.leadsConverted,

                    modifiedOn: new Date(),
                    modifiedBy: campaignData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-Campaign', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Campaign', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Campaign', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteCampaign = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await Campaign.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Campaign', true, 200, data, 'Successfully Remove Campaign');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Campaign', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredCampaign = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.budgetAlloted) {
            andList.push({ budgetAlloted: req.body.budgetAlloted })
        }
        if (req.body.platformName) {
            andList.push({ platformName: req.body.platformName })
        }
      
        if (req.body.campaignName) {
            andList.push({ campaignName: req.body.campaignName })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const campaignList = await Campaign.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const campaignCount = await Campaign.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Campaign', true, 200, { campaignList, campaignCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Campaign', false, 500, {}, errorMessage.internalServer, err.message);
    }
};