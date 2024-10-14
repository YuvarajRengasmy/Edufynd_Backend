import { EnquiryStatus, BusinessStatusDocument } from '../../moduleSetting/model/businessEnquiryStatus.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting BusinessEnquiryStatus";



export const getAllApplicationStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await EnquiryStatus.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-BusinessEnquiryStatus', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-BusinessEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleApplicationStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await EnquiryStatus.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-BusinessEnquiryStatus', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-BusinessEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createApplicationStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: BusinessStatusDocument = req.body;
            const createData = new EnquiryStatus(statusDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-BusinessEnquiryStatus', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-BusinessEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-BusinessEnquiryStatus', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateApplicationStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: BusinessStatusDocument = req.body;

            const statusData = await EnquiryStatus.findByIdAndUpdate(
                { _id: req.query._id },
                {
                    $set: {
                        statusName: statusDetails.statusName,
                        duration: statusDetails.duration,
                        subCategory: statusDetails.subCategory,
                        position: statusDetails.position,
                   
                        modifiedOn: new Date(),
                        modifiedBy: statusDetails.modifiedBy,
                    },
                },
                { new: true }
            );

            if (!statusData) {
                return response(req, res, activity, 'Level-2', 'Update-BusinessEnquiryStatus Details', false, 404, {},  'BusinessEnquiryStatus not found');
            }

            response(req, res, activity, 'Level-2', 'Update-BusinessEnquiryStatus Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-BusinessEnquiryStatus Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-BusinessEnquiryStatus Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteApplicationStatus = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const staff = await EnquiryStatus.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this BusinessEnquiryStatus', true, 200, staff, 'Successfully Remove BusinessEnquiryStatus');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this BusinessEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let getFilteredApplicationStatus   = async (req: any, res:any, next:any) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.statusName) {
            andList.push({ statusName: req.body.statusName })
        }
        if (req.body.duration) {
            andList.push({ duration: req.body.duration })
        }
        if (req.body.subDuration) {
            andList.push({ subDuration: req.body.subDuration })
        }
        if (req.body.subCategory) {
            andList.push({ subCategory: req.body.subCategory })
        }
        
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const statusList = await EnquiryStatus.find(findQuery).sort({ _id: 1 }).limit(limit).skip(page)

        const statusCount = await EnquiryStatus.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStatus', true, 200, { statusList, statusCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterStatus', false, 500, {}, errorMessage.internalServer, err.message);
    }
};