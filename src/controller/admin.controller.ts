import { Admin, AdminDocument } from '../model/admin.model'
import { SuperAdmin, SuperAdminDocument } from '../model/superAdmin.model'
import { Staff, StaffDocument } from '../model/staff.model'
import { Student, StudentDocument } from '../model/student.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt } from "../helper/Encryption";

var activity = "Admin";



export let getAllAdmin = async (req, res, next) => {
    try {
        const data = await Admin.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Admin', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleAdmin = async (req, res, next) => {
    try {
        const agent = await Admin.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Admin', true, 200, agent, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


const generateNextAdminCode = async (): Promise<string> => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const admin = await Admin.find({}, 'adminCode').exec();

    const maxCounter = admin.reduce((max, app) => {

        const appCode = app.adminCode;

        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `AD_${formattedCounter}`;
};

export let createAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await Admin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const adminDetails: AdminDocument = req.body;
                adminDetails.adminCode = await generateNextAdminCode();

                const createData = new Admin(adminDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'admin'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'admin';
                finalResult["adminDetails"] = result;

                response(req, res, activity, 'Level-2', 'Create-Admin', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Admin', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteAdmin = async (req, res, next) => {

    try {
        const agent = await Admin.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-2', 'Delete-Admin', true, 200, agent, 'Successfully Admin University');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let createAdminBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const adminDetails: AdminDocument = req.body;

            adminDetails.adminCode = await generateNextAdminCode();
            req.body.password = await encrypt(req.body.password)
            req.body.confirmPassword = await encrypt(req.body.confirmPassword)
            const createAdmin = new Admin(adminDetails);
            const insertAdmin = await createAdmin.save();

            const newHash = await decrypt(insertAdmin["password"]);

            const mailOptions = {
                from: 'balan9133civil@gmail.com',
                to: insertAdmin.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertAdmin.name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertAdmin.email}\nPassword: ${newHash}\n\nPlease change your password after logging in for the first time.\n\n Best regards\nAfynd Private Limited\nChennai.`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Admin profile created and email sent login credentials', admin: insertAdmin });
                }
            });
            response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', true, 200, { admin: insertAdmin }, 'Admin created successfully by SuperAdmin.');

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};


export const editAdminProfileBySuperAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const adminDetails: AdminDocument = req.body;
            const updateData = await Admin.findOneAndUpdate({ _id: adminDetails._id }, {
                $set: {
                    role: adminDetails.role,
                    modifiedOn: adminDetails.modifiedOn,
                    modifiedBy: adminDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Admin by Super Admin', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Admin by Super Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Admin by Super Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let createStudentByAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const adminDetails: AdminDocument = req.body;
            const studentDetails: StudentDocument = req.body;

            // Admin exist, proceed to create a new student
            const createStudent = new Student(studentDetails);

            // Save the student to the database
            const insertStudent = await createStudent.save();

            // Respond with success message
            response(req, res, activity, 'Level-3', 'Create-Student-By-Admin', true, 200, { student: insertStudent }, 'Student created successfully by Admin.');

        } catch (err: any) {
            // Handle server error
            response(req, res, activity, 'Level-3', 'Create-Student-By-Admin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Student-By-Admin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};



export let createStaffByAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const adminDetails: AdminDocument = req.body;
            const staffDetails: StaffDocument = req.body;

            // Admin exist, proceed to create a new staff
            const createstaff = new Admin(staffDetails);

            // Save the staff to the database
            const insertStaff = await createstaff.save();

            // Respond with success message
            response(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', true, 200, { staff: insertStaff }, 'Staff created successfully by Admin.');

        } catch (err: any) {
            // Handle server error
            response(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Staff-By-Admin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};