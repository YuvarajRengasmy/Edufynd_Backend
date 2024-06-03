
import {Agent, AgentDocument} from '../model/agent.model'
import { Student, StudentDocument } from '../model/student.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt } from "../helper/Encryption";

var activity = "Agent";



export let getAllAgent = async (req, res, next) => {
    try {
        const data = await Agent.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Agent', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleAgent = async (req, res, next) => {
    try {
        const agent = await Agent.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Agent', true, 200, agent, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let createAgent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const agent = await Agent.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!agent) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const agentDetails: AgentDocument = req.body;
                const createData = new Agent(agentDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'agent'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'agent';
                finalResult["agentDetails"] = result;
                response(req, res, activity, 'Level-2', 'Create-Agent', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Agent', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Agent', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Agent', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let updateAgent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const agentDetails: AgentDocument = req.body;
            const updateData = await Agent.findOneAndUpdate({ _id: req.body._id }, {
                $set: {

                    businessName: agentDetails.businessName,
                    whatsAppNumber: agentDetails.whatsAppNumber,
                    bankDetail: agentDetails.bankDetail,
                    panNumberIndividual: agentDetails.panNumberIndividual,
                    panNumberCompany: agentDetails.panNumberCompany,
                    gstn: agentDetails.gstn,
                    inc: agentDetails.inc,
                    agentsCommission: agentDetails.agentsCommission,
                    agentBusinessLogo: agentDetails.agentBusinessLogo,
                    countryInterested: agentDetails.countryInterested,
                    privileges: agentDetails.privileges,
               
                    modifiedOn: agentDetails.modifiedOn,
                    modifiedBy:  agentDetails.modifiedBy,
                },
                $addToSet: {
                    address: agentDetails.address,
                    staffDetail: agentDetails.staffDetail
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Agent', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Agent', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Agent', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}






export let createStudentByAgent = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const agentDetails: AgentDocument = req.body;
            const studentDetails: StudentDocument = req.body;

            // Find the agent in the database
            const agent = await Agent.findOne({ id: agentDetails._id });

            if (agent) {
                // Agent exist, proceed to create a new student
                const createStudent = new Student({
                    ...studentDetails,
                    agentId: agent._id // Add agent ID to student document
                });

                // Save the student to the database
                const insertStudent = await createStudent.save();

                // Respond with success message
                response(req, res, activity, 'Level-3', 'Create-Student-By-Agent', true, 200, {
                    student: insertStudent,
                    agentId: agent._id,
                    AgentName: agent.name
                }, 'Student created successfully by agent.');
            } else {
                // Agent already exists, respond with error message
                response(req, res, activity, 'Level-3', 'Create-Student-By-Agent', false, 422, {}, 'Agent with the provided email already exists.');
            }
        } catch (err: any) {
            // Handle server error

            response(req, res, activity, 'Level-3', 'Create-Student-By-Agent', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        // Request body validation failed, respond with error message
        response(req, res, activity, 'Level-3', 'Create-Student-By-Agent', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};




export let getFiltered = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
       
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId })
        }
        if (req.body.superAdminId) {
            andList.push({ superAdminId: req.body.superAdminId })
        }
      
       
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const agentList = await Agent.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 }) 

        const agentCount = await Agent.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter', true, 200, { agentList, agentCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter', false, 500, {}, errorMessage.internalServer, err.message);
    }
};