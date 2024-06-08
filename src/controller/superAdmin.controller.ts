import { SuperAdmin, SuperAdminDocument } from '../model/superAdmin.model'
import { Student, StudentDocument } from '../model/student.model'
import { Agent, AgentDocument } from '../model/agent.model'
import { Admin, AdminDocument } from '../model/admin.model'
import { Staff, StaffDocument } from '../model/staff.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt } from "../helper/Encryption";

var activity = "SuperAdmin";




export let createSuperAdmin = async (req, res, next) => {
    console.log("bye")
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await SuperAdmin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const superAdminDetails: SuperAdminDocument = req.body;
                const createData = new SuperAdmin(superAdminDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'SuperAdmin'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'SuperAdmin';
                finalResult["superAdminDetails"] = result;

                response(req, res, activity, 'Level-2', 'Create-Super-Admin', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Super-Admin', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Super-Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Super-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let createStudentBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const superAdminDetails: SuperAdminDocument = req.body;
            const studentDetails: StudentDocument = req.body;

            // Find the superAdmin in the database
       const superAdmin = await SuperAdmin.findOne({ _id: req.query._id })
       if(!superAdmin){
           return res.status(400).json({ success: false, message: 'Super Admin ID is required' });

       }
                // SuperAdmin exist, proceed to create a new student
                const createStudent = new Student({...studentDetails,superAdminId: superAdmin._id });

                // Save the student to the database
                const insertStudent = await createStudent.save();

                // Respond with success message
                response(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', true, 200, {
                    student: insertStudent,
                    superAdminId: superAdmin._id
                  
                }, 'Student created successfully by SuperAdmin.');
         
        } catch (err: any) {
            // Handle server error

            response(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Student-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};




export let createAgentBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const superAdminDetails: SuperAdminDocument = req.body;
            const agentDetails: AgentDocument = req.body;

            // Find the superAdmin in the database
       const superAdmin = await SuperAdmin.findOne({ _id: req.query._id })
       if(!superAdmin){
           return res.status(400).json({ success: false, message: 'Super Admin ID is required' });

       }
                // SuperAdmin exist, proceed to create a new agent
                const createAgent = new Agent({...agentDetails, superAdminId: superAdmin._id });

                // Save the agent to the database
                const insertAgent = await createAgent.save();

                // Respond with success message
                response(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', true, 200, {
                    agent: insertAgent,
                    superAdminId: superAdmin._id
                  
                }, 'Agent created successfully by SuperAdmin.');
         
        } catch (err: any) {
            // Handle server error

            response(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};




export let createAdminBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const superAdminDetails: SuperAdminDocument = req.body;
            const adminDetails: AdminDocument = req.body;

            // Find the superAdmin in the database
       const superAdmin = await SuperAdmin.findOne({ _id: req.query._id })
       if(!superAdmin){
           return res.status(400).json({ success: false, message: 'Super Admin ID is required' });

       }
                // SuperAdmin exist, proceed to create a new agent
                const createAdmin = new Admin({...adminDetails, superAdminId: superAdmin._id });

                // Save the agent to the database
                const insertAdmin = await createAdmin.save();

                // Respond with success message
                response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', true, 200, {
                    admin: insertAdmin,
                    superAdminId: superAdmin._id
                  
                }, 'Admin created successfully by SuperAdmin.');
         
        } catch (err: any) {
            // Handle server error

            response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Admin-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};




export let createStaffBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const superAdminDetails: SuperAdminDocument = req.body;
            const staffDetails: StaffDocument = req.body;
           
            // Find the superAdmin in the database
       const superAdmin = await SuperAdmin.findOne({ _id: req.query._id })
       if(!superAdmin){
           return res.status(400).json({ success: false, message: 'Super Admin ID is required' });

       }
                // SuperAdmin exist, proceed to create a new staff
                const createstaff = new Admin({...staffDetails, superAdminId: superAdmin._id });

                // Save the agent to the database
                const insertStaff = await createstaff.save();

                // Respond with success message
                response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', true, 200, {
                    staff: insertStaff,
                    superAdminId: superAdmin._id
                  
                }, 'Staff created successfully by SuperAdmin.');
         
        } catch (err: any) {
            // Handle server error

            response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Staff-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};




