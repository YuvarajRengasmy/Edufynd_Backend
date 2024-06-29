import { Staff, StaffDocument } from '../model/staff.model'
import { SuperAdmin, SuperAdminDocument } from '../model/superAdmin.model'
import { validationResult } from 'express-validator'
import { response, transporter } from '../helper/commonResponseHandler'
import { decrypt, encrypt } from "../helper/Encryption";
import { clientError, errorMessage } from '../helper/ErrorMessage'
import csv = require('csvtojson')

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


export let createStaffBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {

            const staffDetails: StaffDocument = req.body;
            req.body.password = await encrypt(req.body.password)
            req.body.confirmPassword = await encrypt(req.body.confirmPassword)
            const createStaff = new Staff(staffDetails);
            const insertStaff = await createStaff.save();
            const newHash = await decrypt(insertStaff["password"]);
         
            const mailOptions = {
                from: 'balan9133civil@gmail.com', 
                to: insertStaff.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertStaff.empName},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertStaff.email}\nPassword: ${newHash}\n\nPlease change your password after logging in for the first time.\n\n Best regards\nAfynd Private Limited\nChennai.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
   
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Staff profile created and email sent login credentials', agent: insertStaff });
                }
            });
            response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', true, 200, {
                agent: insertStaff,
    

            }, 'Staff created successfully by SuperAdmin.');

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
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



export const csvToJson = async (req, res) => {
    try {
        let staffList = [];
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);

        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            staffList.push({
                empName:csvData[i].EmpName,
                designation:csvData[i].Designation,
                jobDescription: csvData[i].JobDescription,
                reportingManager: csvData[i].ReportingManager,
                shiftTiming: csvData[i].ShiftTiming,                       
                areTheyEligibleForCasualLeave: csvData[i].AreTheyEligibleForCasualLeave,          
                doj: csvData[i].DOJ,                    
                dob: csvData[i].DOB,                   
                addressline1:csvData[i].AddressLine1,
                addressline2:csvData[i].AddressLine2,
                addressline3:csvData[i].AddressLine3,
                email: csvData[i].Email,
                mobileNumber: csvData[i].MobileNo,
                emergencyContactNo: csvData[i].EmergencyContactNo,
                probationDuration: csvData[i].ProbationDuration,
                salary:csvData[i].salary,                   
                idCard: csvData[i].IDCard,                    
                manageApplications: csvData[i].ManageApplications,         
                activeInactive: csvData[i].ActiveInactive,              
                teamLead: csvData[i].TeamLead,     
                
            });
        }

        // Insert into the database
        await Staff.insertMany(staffList);
        // Send success response
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for staff module', true, 200, { staffList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        console.error(err);
        // Send error response
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for staff module', false, 500, {}, 'Internal Server Error', err.message);
    }
};
