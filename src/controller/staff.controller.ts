import { Staff, StaffDocument } from '../model/staff.model'
import { validationResult } from 'express-validator'
import { response } from '../helper/commonResponseHandler'
import { clientError, errorMessage } from '../helper/ErrorMessage'

var activity = "Staff"

export const getAllStaff = async (req, res) => {
    try {
        const data = await Staff.find({ isDeleted: false })
        response(req, res, activity, 'Level-1', 'GetAll-Staff', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Staff', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleStaff = async (req, res) => {
    try {
        const data = await Staff.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Staff', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Staff', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createStaff = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const staffDetails: StaffDocument = req.body;
            const createData = new Staff(staffDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Staff', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Staff', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Staff', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateStaff = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const staffDetails: StaffDocument = req.body;
            let staffData = await Staff.findByIdAndUpdate({ _id: staffDetails._id }, {
                $set: {
                    photo:staffDetails.photo,
                    empName: staffDetails.empName,
                    designation:staffDetails.designation,
                    jobDescription: staffDetails.jobDescription,
                    reportingManager:staffDetails.reportingManager,
                    shiftTiming:staffDetails.shiftTiming,                    
                    areTheyEligibleForCasualLeave: staffDetails.areTheyEligibleForCasualLeave,                
                    address:staffDetails.address,
                    emergencyContactNo:staffDetails.emergencyContactNo,
                    probationDuration: staffDetails.probationDuration,
                    salary: staffDetails.salary,              
                    privileges:staffDetails.privileges,               
                    idCard: staffDetails.idCard,                  
                    manageApplications:staffDetails.manageApplications,         
                    activeInactive: staffDetails.activeInactive,             
                    teamLead: staffDetails.teamLead,
                    status:  staffDetails.status,
                    modifiedOn: staffDetails.modifiedOn,
                    modifiedBy:  staffDetails.modifiedBy,
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Staff Details', true, 200, staffData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Staff Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Staff Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteStaff = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const staff = await Staff.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Delete-StaffDetail', true, 200, staff, 'Successfully Remove Staff');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-StaffDetail', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




/**
 * @author Balan K K
 * @date 28-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter Staff Details
 */

export let getFilteredStaff = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.empName) {
            andList.push({ empName: req.body.empName })
        }
        if (req.body.designation) {
            andList.push({ designation: req.body.designation })
        }
        if (req.body.reportingManager) {
            andList.push({ reportingManager: req.body.reportingManager })
        }
        if (req.body.manageApplications) {
            andList.push({ manageApplications: req.body.manageApplications })
        }
        if (req.body.teamLead) {
            andList.push({ teamLead: req.body.teamLead })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const staffList = await Staff.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const staffCount = await Staff.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStaff', true, 200, { staffList, staffCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterStaff', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


