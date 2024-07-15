import { Marketing, MarketingDocument } from './marketing.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Marketing";



export const getAllMarketing = async (req, res) => {
    try {
        const data = await Marketing.find()
        response(req, res, activity, 'Level-1', 'GetAll-Marketing', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Marketing', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleMarketing = async (req, res) => {
    try {
        const data = await Marketing.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Marketing', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Marketing', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createMarketing = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const Data: MarketingDocument = req.body;
            const createData = new Marketing(Data);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Marketing', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Marketing', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Marketing', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateMarketing = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const marketingData: MarketingDocument = req.body;
            let statusData = await Marketing.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {

                    socialMedia: marketingData.socialMedia,
                    noOfFollowers: marketingData.noOfFollowers,
                    noOfCampaigns: marketingData.noOfCampaigns,
                    noOfLeads: marketingData.noOfLeads,
                    platformName: marketingData.platformName,
                    campaignName: marketingData.campaignName,
                    budgetRequested: marketingData.budgetRequested,
                    budgetAlloted: marketingData.budgetAlloted,
                    budgetSpent: marketingData.budgetSpent,
                    leadsGenerated: marketingData.leadsGenerated,
                    leadsConverted: marketingData.leadsConverted,

                    modifiedOn: new Date(),
                    modifiedBy: marketingData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-Marketing', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Marketing', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Marketing', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteMarketing = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await Marketing.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Marketing', true, 200, data, 'Successfully Remove Marketing');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Marketing', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredMarketing = async (req, res, next) => {
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
        if (req.body.platformName) {
            andList.push({ platformName: req.body.platformName })
        }
      
        if (req.body.campaignName) {
            andList.push({ campaignName: req.body.campaignName })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const marketingList = await Marketing.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const marketingCount = await Marketing.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Marketing', true, 200, { marketingList, marketingCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Marketing', false, 500, {}, errorMessage.internalServer, err.message);
    }
};