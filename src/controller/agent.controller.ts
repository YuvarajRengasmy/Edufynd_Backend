import { Agent, AgentDocument } from '../model/agent.model'
import { SuperAdmin, SuperAdminDocument } from '../model/superAdmin.model'
import { Student, StudentDocument } from '../model/student.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt, generateRandomPassword } from "../helper/Encryption";
import csv = require('csvtojson')

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

const generateNextAgentID = async (): Promise<string> => {
    // Retrieve all client IDs to determine the highest existing client counter
    const agents = await Agent.find({}, 'agentCode').exec();
    const maxCounter = agents.reduce((max, agent) => {
        const agentCode = agent.agentCode;
        const counter = parseInt(agentCode.split('_')[1], 10);
        return counter > max ? counter : max;
    }, 0);

    // Increment the counter
    const newCounter = maxCounter + 1;

    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');

    // Return the new client ID
    return `AG_${formattedCounter}`;
};



export let createAgent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const agent = await Agent.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!agent) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const agentDetails: AgentDocument = req.body;
                // const createData = new Agent(agentDetails);
                agentDetails.createdOn = new Date()
                agentDetails.agentCode = await generateNextAgentID();

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
            const updateData = await Agent.findOneAndUpdate({ _id: agentDetails._id }, {
                $set: {
                    source: agentDetails.source,
                    businessName: agentDetails.businessName,
                    agentName: agentDetails.agentName,
                    mobileNumber: agentDetails.mobileNumber,
                    whatsAppNumber: agentDetails.whatsAppNumber,
                    accountName: agentDetails.accountName,
                    accountNumber: agentDetails.accountNumber,
                    bankName: agentDetails.bankName,
                    ifsc: agentDetails.ifsc,
                    branch: agentDetails.branch,
                    panNumberIndividual: agentDetails.panNumberIndividual,
                    panNumberCompany: agentDetails.panNumberCompany,
                    gstn: agentDetails.gstn,
                    inc: agentDetails.inc,
                    agentsCommission: agentDetails.agentsCommission,
                    agentBusinessLogo: agentDetails.agentBusinessLogo,
                    countryInterested: agentDetails.countryInterested,
                    privileges: agentDetails.privileges,
                    addressLine1: agentDetails.addressLine1,
                    addressLine2: agentDetails.addressLine2,
                    addressLine3: agentDetails.addressLine3,
                    staffName: agentDetails.staffName,
                    staffContactNo: agentDetails.staffContactNo,

                    // Newly Added Field
                    businessWebsite: agentDetails.businessWebsite,
                    pin: agentDetails.pin,
                    city: agentDetails.city,
                    state: agentDetails.state,
                    country: agentDetails.country,
                    registrationNo: agentDetails.registrationNo,
                    whatsApp: agentDetails.whatsApp,
                    accountType: agentDetails.accountType,
                    swift: agentDetails.swift,
                    desiredCountry: agentDetails.desiredCountry,
                    requireVisaFilingSupport: agentDetails.requireVisaFilingSupport,
                    visaCommission: agentDetails.visaCommission,


                    modifiedOn: new Date(),
                    modifiedBy: agentDetails.modifiedBy,
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



export let deleteAgent = async (req, res, next) => {
    try {
        const agent = await Agent.findOneAndDelete({ _id: req.query._id })
        response(req, res, activity, 'Level-2', 'Delete-Agent', true, 200, agent, 'Successfully Agent University');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let createAgentBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const agentDetails: AgentDocument = req.body;
            agentDetails.agentCode = await generateNextAgentID();
            const password = generateRandomPassword(8);
            const confirmPassword = password; // Since password and confirmPassword should match
            agentDetails.password = await encrypt(password)
            agentDetails.confirmPassword = await encrypt(confirmPassword)
            const createAgent = new Agent(agentDetails);
            const insertAgent = await createAgent.save();
            const newHash = await decrypt(insertAgent["password"]);
            const mailOptions = {
                from: 'balan9133civil@gmail.com',
                to: insertAgent.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${insertAgent.agentName},\n\nYour account has been created successfully.\n\nYour login credentials are:\nUsername: ${insertAgent.email}\nPassword: ${newHash}\n\nPlease change your password after logging in for the first time.\n\n Best regards\nAfynd Private Limited\nChennai.`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Agent profile created and email sent login credentials', agent: insertAgent });
                }
            });
            response(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', true, 200, {
                agent: insertAgent,


            }, 'Agent created successfully by SuperAdmin.');

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};



export const createStudentProfileByAgent = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {

        try {
            const studentDetails: StudentDocument = req.body;
            const agentId = req.agent._id;
            const newStudent = new Student({ ...studentDetails, agentId: agentId });
            await newStudent.save();
            response(req, res, activity, 'Level-3', 'Create-Student-By-Agent', true, 200, newStudent, 'Student created successfully by agent.');
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Student-By-Agent', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {

        response(req, res, activity, 'Level-3', 'Create-Student-By-Agent', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};



export const viewStudentProfileByAgent = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentId = await Student.find({ _id: req.query.studentId })
            const student = await Student.findById(studentId).populate('agentId', 'name email');

            if (!student) {
                return res.status(400).json({ success: false, message: 'Student Not Found' });
            }
            response(req, res, activity, 'Level-1', 'View Student by Agent', true, 200, student, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'View-Student-By-Agent', false, 500, {}, 'Internal server error.', err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'View-Student-By-Agent', false, 422, {}, 'Field validation error.', JSON.stringify(errors.mapped()));
    }
};


export const editStudentProfileByAgent = async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const studentDetails: StudentDocument = req.body;
            const updateData = await Student.findOneAndUpdate({ _id: studentDetails._id }, {
                $set: {
                    name: studentDetails.name,
                    passportNo: studentDetails.passportNo,
                    expiryDate: studentDetails.expiryDate,
                    dob: studentDetails.dob,
                    citizenship: studentDetails.citizenship,
                    gender: studentDetails.gender,
                    whatsAppNumber: studentDetails.whatsAppNumber,
                    degreeName: studentDetails.degreeName,
                    academicYear: studentDetails.academicYear,
                    institution: studentDetails.institution,
                    percentage: studentDetails.percentage,
                    doHaveAnyEnglishLanguageTest: studentDetails.doHaveAnyEnglishLanguageTest,
                    englishTestType: studentDetails.englishTestType,
                    testScore: studentDetails.testScore,
                    dateOfTest: studentDetails.dateOfTest,
                    country: studentDetails.country,
                    desiredUniversity: studentDetails.desiredUniversity,
                    desiredCourse: studentDetails.desiredCourse,
                    workExperience: studentDetails.workExperience,
                    anyVisaRejections: studentDetails.anyVisaRejections,
                    visaReason: studentDetails.visaReason,
                    doYouHaveTravelHistory: studentDetails.doYouHaveTravelHistory,
                    travelReason: studentDetails.travelReason,
                    finance: studentDetails.finance,
                    twitter: studentDetails.twitter,
                    facebook: studentDetails.facebook,
                    instagram: studentDetails.instagram,
                    linkedIn: studentDetails.linkedIn,

                    modifiedOn: new Date(),
                    modifiedBy: studentDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Student by Agent', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Student by Agent', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Student by Agent', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deleteStudentByAgent = async (req, res, next) => {

    try {
        let id = req.query.studentId;
        const student = await Student.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Student by Agent', true, 200, student, 'Successfully Remove Student by Agent');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Student by Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredStudentByAgent = async (req, res, next) => {
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

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const agentList = await Agent.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 })

        const agentCount = await Agent.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter', true, 200, { agentList, agentCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export const csvToJson = async (req, res) => {
    try {
        let agentList = [];
        // Parse CSV file
        const csvData = await csv().fromFile(req.file.path);

        // Process CSV data
        for (let i = 0; i < csvData.length; i++) {
            agentList.push({
                agentName: csvData[i].AgentName,
                businessName: csvData[i].BusinessName,
                email: csvData[i].Email,
                mobileNumber: csvData[i].MobileNumber,
                whatsAppNumber: csvData[i].WhatsAppNumber,
                addressLine1: csvData[i].addressLine1,
                addressLine2: csvData[i].addressLine2,
                addressLine3: csvData[i].addressLine3,
                panNumberIndividual: csvData[i].PanNumberIndividual,
                panNumberCompany: csvData[i].PanNumberCompany,
                gstn: csvData[i].GSTN,
                inc: csvData[i].INC,
                staffName: csvData[i].StaffName,
                staffContactNo: csvData[i].StaffContactNo,
                agentsCommission: csvData[i].AcademicRequirementgentsCommission,
                countryInterested: csvData[i].CountryInterested,

            });
        }

        // Insert into the database
        await Agent.insertMany(agentList);
        // Send success response
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for agent module', true, 200, { agentList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        console.error(err);
        // Send error response
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for agent module', false, 500, {}, 'Internal Server Error', err.message);
    }
};
