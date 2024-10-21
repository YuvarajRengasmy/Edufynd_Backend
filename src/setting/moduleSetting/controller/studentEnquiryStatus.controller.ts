import { EnquiryStatus, StudentEnquiryStatusDocument } from '../../moduleSetting/model/studentEnquiryStatus.model'
import { validationResult } from "express-validator";
import { response, } from "../../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../../helper/ErrorMessage";


var activity = "ModuleSetting StudentEnquiryStatus";



export const getAllApplicationStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await EnquiryStatus.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-StudentEnquiryStatus', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-StudentEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleApplicationStatus = async (req: any, res:any, next:any) => {
    try {
        const data = await EnquiryStatus.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-StudentEnquiryStatus', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-StudentEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createApplicationStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: StudentEnquiryStatusDocument = req.body;
            const createData = new EnquiryStatus(statusDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-StudentEnquiryStatus', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-StudentEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-StudentEnquiryStatus', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateApplicationStatus = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const statusDetails: StudentEnquiryStatusDocument = req.body;

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
                return response(req, res, activity, 'Level-2', 'Update-StudentEnquiryStatus Details', false, 404, {},  'StudentEnquiryStatus not found');
            }

            response(req, res, activity, 'Level-2', 'Update-StudentEnquiryStatus Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log("Error updating status:", err);
            response(req, res, activity, 'Level-3', 'Update-StudentEnquiryStatus Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-StudentEnquiryStatus Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteApplicationStatus = async (req: any, res:any, next:any) => {
  
    try {
        let id = req.query._id;
        const staff = await EnquiryStatus.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted this StudentEnquiryStatus', true, 200, staff, 'Successfully Remove StudentEnquiryStatus');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted this StudentEnquiryStatus', false, 500, {}, errorMessage.internalServer, err.message);
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