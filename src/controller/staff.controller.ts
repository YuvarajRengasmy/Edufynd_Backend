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