import { Staff, StaffDocument } from '../model/staff.model'
import { Logs } from "../model/logs.model";
import { Student, StudentDocument } from '../model/student.model'
import { SuperAdmin } from '../model/superAdmin.model'
import { Admin } from '../model/admin.model'
import { Agent } from '../model/agent.model'
import { validationResult } from 'express-validator'
import { response, transporter } from '../helper/commonResponseHandler'
import { decrypt, encrypt, generateRandomPassword } from "../helper/Encryption";
import { clientError, errorMessage } from '../helper/ErrorMessage'
import * as config from '../config';
import csv = require('csvtojson')
import moment = require('moment');

var activity = "Staff"

export const getAllStaff = async (req, res) => {
    try {
        const data = await Staff.find({ isDeleted: false }).sort({ employeeID: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Staff', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Staff', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let getAllLoggedStaff = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Staff" })
        response(req, res, activity, 'Level-1', 'All-Logged Staff', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Staff', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedStaff = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged Staff', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged Staff', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged Staff', false, 500, {}, errorMessage.internalServer, err.message);
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

const generateNextStaffID = async (): Promise<string> => {
    const staff = await Staff.find({}, 'employeeID').exec();

    const maxCounter = staff.reduce((max, app) => {
        const appCode = app.employeeID;
        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 100);
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `EMP_${formattedCounter}`;
};


export let createStaff = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const staffDetails: StaffDocument = req.body;
            staffDetails.createdOn = new Date();
            staffDetails.employeeID = await generateNextStaffID();
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


export const updateStaffdd = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const staffDetails: StaffDocument = req.body;
            let staffData = await Staff.findByIdAndUpdate({ _id: staffDetails._id }, {
                $set: {
                    photo: staffDetails.photo,
                    empName: staffDetails.empName,
                    designation: staffDetails.designation,
                    jobDescription: staffDetails.jobDescription,
                    reportingManager: staffDetails.reportingManager,
                    shiftTiming: staffDetails.shiftTiming,
                    areTheyEligibleForCasualLeave: staffDetails.areTheyEligibleForCasualLeave,
                    address: staffDetails.address,
                    description: staffDetails.description,
                    emergencyContactNo: staffDetails.emergencyContactNo,
                    probationDuration: staffDetails.probationDuration,
                    salary: staffDetails.salary,
                    role: staffDetails.role,
                    active: staffDetails.active,
                    privileges: staffDetails.privileges,
                    idCard: staffDetails.idCard,
                    manageApplications: staffDetails.manageApplications,
                    teamLead: staffDetails.teamLead,

                    // Newly added fields
                    team: staffDetails.team,
                    staffList: staffDetails.staffList,
                    personalMail: staffDetails.personalMail,
                    address2: staffDetails.address2,
                    pin: staffDetails.pin,
                    country: staffDetails.country,
                    state: staffDetails.state,
                    city: staffDetails.city,
                    activeStatus: staffDetails.activeStatus,
                    companyAssests: staffDetails.companyAssests,
                    mobileName: staffDetails.mobileName,
                    brandName: staffDetails.brandName,
                    imei: staffDetails.imei,
                    phoneNumber: staffDetails.phoneNumber,
                    laptopName: staffDetails.laptopName,
                    brand: staffDetails.brand,
                    modelName: staffDetails.modelName,
                    ipAddress: staffDetails.ipAddress,
                    userName: staffDetails.userName,
                    loginPassword: staffDetails.loginPassword,
                    dial1: staffDetails.dial1,
                    dial2: staffDetails.dial2,
                    dial3: staffDetails.dial3,


                    modifiedOn: new Date(),
                    modifiedBy: staffDetails.modifiedBy,
                }

            });

            response(req, res, activity, 'Level-1', 'Update-Staff Details', true, 200, staffData, clientError.success.updateSuccess);
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-2', 'Update-Staff Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Staff Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export const updateStaff = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const staffDetails: StaffDocument = req.body;
            const updateData = {
                photo: staffDetails.photo,
                empName: staffDetails.empName,
                designation: staffDetails.designation,
                jobDescription: staffDetails.jobDescription,
                reportingManager: staffDetails.reportingManager,
                shiftTiming: staffDetails.shiftTiming,
                areTheyEligibleForCasualLeave: staffDetails.areTheyEligibleForCasualLeave,
                address: staffDetails.address,
                description: staffDetails.description,
                emergencyContactNo: staffDetails.emergencyContactNo,
                probationDuration: staffDetails.probationDuration,
                salary: staffDetails.salary,
                role: staffDetails.role,
                active: staffDetails.active,
                idCard: staffDetails.idCard,
                manageApplications: staffDetails.manageApplications,
                teamLead: staffDetails.teamLead,

                // Newly added fields
                team: staffDetails.team,
                staffList: staffDetails.staffList,
                personalMail: staffDetails.personalMail,
                address2: staffDetails.address2,
                pin: staffDetails.pin,
                country: staffDetails.country,
                state: staffDetails.state,
                city: staffDetails.city,
                activeStatus: staffDetails.activeStatus,
                companyAssests: staffDetails.companyAssests,
                mobileName: staffDetails.mobileName,
                brandName: staffDetails.brandName,
                imei: staffDetails.imei,
                phoneNumber: staffDetails.phoneNumber,
                laptopName: staffDetails.laptopName,
                brand: staffDetails.brand,
                modelName: staffDetails.modelName,
                ipAddress: staffDetails.ipAddress,
                userName: staffDetails.userName,
                loginPassword: staffDetails.loginPassword,
                dial1: staffDetails.dial1,
                dial2: staffDetails.dial2,
                dial3: staffDetails.dial3,


                modifiedOn: new Date(),
                modifiedBy: staffDetails.modifiedBy,
                privileges: staffDetails.privileges,

            };

            if (staffDetails.privileges && staffDetails.privileges.length > 0) {
                // Updating the entire privileges array
                updateData.privileges = staffDetails.privileges;

            }

            const staffData = await Staff.findByIdAndUpdate(
                { _id: staffDetails._id },
                {
                    $set: updateData,
                },
                { new: true } // Return the updated document
            );

            if (!staffData) {
                return res.status(404).json({ message: 'Staff not found' });
            }

            response(req, res, activity, 'Level-2', 'Update-Staff Details', true, 200, staffData, 'Staff details updated successfully');
        } catch (err) {
            console.error('Error updating staff:', err);
            response(req, res, activity, 'Level-3', 'Update-Staff Details', false, 500, {}, 'Internal server error', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Staff Details', false, 422, {}, 'Validation error', JSON.stringify(errors.mapped()));
    }
};


export let deleteStaff = async (req, res, next) => {

    try {
        let id = req.query._id;
        const staff = await Staff.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Delete-StaffDetail', true, 200, staff, 'Successfully Remove the Staff');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-StaffDetail', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let createStaffBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const student = await Student.findOne({ email: req.body.email });
            const superAdmin = await SuperAdmin.findOne({ email: req.body.email })
            const staff = await Staff.findOne({ email: req.body.email })
            const agent = await Agent.findOne({ email: req.body.email })
            const admin = await Admin.findOne({ email: req.body.email })

            if (!student && !superAdmin && !staff && !agent && !admin) {

                const staffDetails: StaffDocument = req.body;
                const password = generateRandomPassword(8);
                const confirmPassword = password; // Since password and confirmPassword should match
                staffDetails.password = await encrypt(password)
                staffDetails.confirmPassword = await encrypt(confirmPassword)
                staffDetails.createdOn = new Date();
                staffDetails.employeeID = await generateNextStaffID();
                const createStaff = new Staff(staffDetails);
                const insertStaff = await createStaff.save();
                const newHash = await decrypt(insertStaff["password"]);



                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: insertStaff.email,
                    subject: 'Welcome to EduFynd',
                    html: `
                              <body style="font-family: 'Poppins', Arial, sans-serif">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                          <td align="center" style="padding: 20px;">
                                              <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                  <!-- Header -->
                                                  <tr>
                                                      <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                      Login Credentials
                                                      </td>
                                                  </tr>
                      
                                                  <!-- Body -->
                                                  <tr>
                                                      <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                              <p>Your account has been created successfully.</p>
                                                               <p>Hello ${insertStaff.empName},</p>
                        
                                                          <p style="font-weight: bold,color: #345C72">UserID: ${insertStaff.email}</p>
                                                            <p style="font-weight: bold,color: #345C72">Password: ${newHash}</p>
                                                             <p style="font-weight: bold,color: #345C72">Please change your password after logging in for the first time.</p>
                                                          
                                                   
                                                             <p>Team,<br>Edufynd Private Limited,<br>Chennai.</p>
                                                      </td>
                                                  </tr>
                                                  <tr>
                              <td style="padding: 30px 40px 30px 40px; text-align: center;">
                                  <!-- CTA Button -->
                                  <table cellspacing="0" cellpadding="0" style="margin: auto;">
                                      <tr>
                                          <td align="center" style="background-color: #345C72; padding: 10px 20px; border-radius: 5px;">
                                              <a href="https://crm.edufynd.in/" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">Here Click to Login</a>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>  
                      
                                                  <!-- Footer -->
                                                  <tr>
                                                      <td class="footer" style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                                                          Copyright &copy; 2024 | All rights reserved
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </body>
                          `,

                };

                transporter.sendMail(mailOptions, (error, info) => {

                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email' });
                    } else {
                        console.log('Email sent:', info.response);
                        return res.status(201).json({ message: 'Staff profile created and email sent login credentials', agent: insertStaff });
                    }
                });
                return response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', true, 200, { agent: insertStaff }, 'Staff created successfully by SuperAdmin.');
            } else {
                response(req, res, activity, 'Level-2', 'Create-Staff-By-SuperAdmin', true, 422, {}, 'This Email already registered');
            }

        } catch (err: any) {
            console.log(err)
            return response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        return response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
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
        // andList.push({ status: 1 })
        if (req.body.agentId) {
            andList.push({ agentId: req.body.agentId })
        }
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

        const staffList = await Staff.find(findQuery).sort({employeeID: -1}).limit(limit).skip(page).populate('adminId').exec();
        const staffCount = await Staff.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterStaff', true, 200, { staffList, staffCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        console.log(err)
        response(req, res, activity, 'Level-3', 'Get-FilterStaff', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export const csvToJson = async (req, res) => {
    try {
        let staffList = [];
        const csvData = await csv().fromFile(req.file.path);
        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            staffList.push({
                empName: csvData[i].EmpName,
                designation: csvData[i].Designation,
                jobDescription: csvData[i].JobDescription,
                reportingManager: csvData[i].ReportingManager,
                shiftTiming: csvData[i].ShiftTiming,
                areTheyEligibleForCasualLeave: csvData[i].AreTheyEligibleForCasualLeave,
                doj: csvData[i].DOJ,
                dob: csvData[i].DOB,
                addressline1: csvData[i].AddressLine1,
                addressline2: csvData[i].AddressLine2,
                addressline3: csvData[i].AddressLine3,
                email: csvData[i].Email,
                mobileNumber: csvData[i].MobileNo,
                emergencyContactNo: csvData[i].EmergencyContactNo,
                probationDuration: csvData[i].ProbationDuration,
                salary: csvData[i].salary,
                idCard: csvData[i].IDCard,
                manageApplications: csvData[i].ManageApplications,
                activeInactive: csvData[i].ActiveInactive,
                teamLead: csvData[i].TeamLead,

            });
        }
        await Staff.insertMany(staffList);
        // Send success response
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for staff module', true, 200, { staffList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        console.error(err);
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for staff module', false, 500, {}, 'Internal Server Error', err.message);
    }
};


export let createStudentByStaff = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const staffDetails: StaffDocument = req.body;
            const studentDetails: StudentDocument = req.body;
            const createStudent = new Student(studentDetails);
            const insertStudent = await createStudent.save();
            response(req, res, activity, 'Level-3', 'Create-Student-By-Staff', true, 200, { student: insertStudent }, 'Student created successfully by Staff');

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Student-By-Staff', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Student-By-Staff', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};


