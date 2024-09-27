import { Agent, AgentDocument } from '../model/agent.model'
import { Logs } from "../model/logs.model";
import { Student, StudentDocument } from '../model/student.model'
import { Admin} from '../model/admin.model'
import { Staff} from '../model/staff.model'
import { SuperAdmin} from '../model/superAdmin.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt, generateRandomPassword } from "../helper/Encryption";
import * as config from '../config';
import csv = require('csvtojson')

var activity = "Agent";



export let getAllAgent = async (req, res, next) => {
    try {
        const data = await Agent.find({ isDeleted: false }).sort({ agentCode: -1 });
        response(req, res, activity, 'Level-1', 'GetAll-Agent', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getAllLoggedAgent= async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Agent" })
        response(req, res, activity, 'Level-1', 'All-Logged Agent', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleLoggedAgent = async (req, res) => {
    try {
        const { _id } = req.query;

        // Fetch logs that match the documentId
        const logs = await Logs.find({ documentId: _id });

        // If no logs are found, return a 404 response and stop further execution
        if (!logs || logs.length === 0) {
            return response(req, res, activity, 'Level-2', 'Single-Logged Agent', false, 404, {}, "No logs found.");
        }

        // If logs are found, return a 200 response with logs data
        return response(req, res, activity, 'Level-1', 'Single-Logged Agent', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        // Handle errors and return a 500 response, then stop execution
        return response(req, res, activity, 'Level-2', 'Single-Logged Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


  
export let getSingleAgent = async (req, res, next) => {
    try {
        const agent = await Agent.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Agent', true, 200, agent, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Single-Agent', false, 500, {}, errorMessage.internalServer, err.message);
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
                const agentDetails: AgentDocument = req.body;
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)
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
                response(req, res, activity, 'Level-1', 'Create-Agent', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-2', 'Create-Agent', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-2', 'Create-Agent', false, 500, {}, errorMessage.internalServer, err.message);
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
                    dial1: agentDetails.dial1,
                    dial2: agentDetails.dial2,
                    dial3: agentDetails.dial3,
                    dial4: agentDetails.dial4,
                    role: agentDetails.role,
                    privileges: agentDetails.privileges,
                  

                    modifiedOn: new Date(),
                    modifiedBy: agentDetails.modifiedBy,
                }


            });
            response(req, res, activity, 'Level-1', 'Update-Agent', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Agent', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Agent', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let deleteAgent = async (req, res, next) => {
    try {
        const agent = await Agent.findOneAndDelete({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'Delete-Agent', true, 200, agent, 'Successfully Remove the Agent');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-2', 'Delete-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredAgent = async (req, res, next) => {
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
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName })
        }
        if (req.body.businessName) {
            andList.push({ businessName: req.body.businessName })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.mobileNumber) {
            andList.push({ studentId: req.body.mobileNumber })
        }
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const agentList = await Agent.find(findQuery).sort({ agentCode: -1 }).limit(limit).skip(page)

        const agentCount = await Agent.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter-Agent', true, 200, { agentList, agentCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Filter-Agent', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let createAgentBySuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
        
            const student = await Student.findOne({ email: req.body.email });
            const superAdmin = await SuperAdmin.findOne({ email: req.body.email })
            const staff = await Staff.findOne({ email: req.body.email })
            const agent = await Agent.findOne({ email: req.body.email })
            const admin = await Admin.findOne({ email: req.body.email })

            if(!student && !superAdmin && !staff && !agent && !admin ){

                const agentDetails: AgentDocument = req.body;
                agentDetails.agentCode = await generateNextAgentID();
                const password = generateRandomPassword(8);
                const confirmPassword = password; // Since password and confirmPassword should match
                agentDetails.password = await encrypt(password)
                agentDetails.confirmPassword = await encrypt(confirmPassword)
                agentDetails.createdOn = new Date();
                const createAgent = new Agent(agentDetails);
                const insertAgent = await createAgent.save();
                const newHash = await decrypt(insertAgent["password"]);
                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: insertAgent.email,
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
                                                      Agent Login Credentials
                                                      </td>
                                                  </tr>
                      
                                                  <!-- Body -->
                                                  <tr>
                                                      <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                              <p>Your account has been created successfully.</p>
                                                              <p>Hello ${insertAgent.agentName},</p>
                        
                                                          <p style="font-weight: bold,color: #345C72">UserID: ${insertAgent.email}</p>
                                                            <p style="font-weight: bold,color: #345C72">Password: <b>${newHash}</b></p>
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
                        res.status(201).json({ message: 'Agent profile created and email sent login credentials', agent: insertAgent });
                    }
                });
                response(req, res, activity, 'Level-1', 'Create-Agent-By-SuperAdmin', true, 200, { agent: insertAgent }, 'Agent created successfully by SuperAdmin.');
            } else {
                response(req, res, activity, 'Level-2', 'Create-Agent-By-SuperAdmin', true, 422, {}, 'This Email already registered');
            }
        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Agent-By-SuperAdmin', false, 500, {}, 'Field validation error', err.message);
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
            response(req, res, activity, 'Level-1', 'Create-Student-By-Agent', true, 200, newStudent, 'Student created successfully by agent.');
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-Student-By-Agent', false, 500, {}, 'Internal server error.', err.message);
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
            response(req, res, activity, 'Level-2', 'View-Student-By-Agent', false, 500, {}, 'Internal server error.', err.message);
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
                    desiredCountry: studentDetails.desiredCountry,
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
            response(req, res, activity, 'Level-1', 'Update-Student by Agent', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Student by Agent', false, 500, {}, errorMessage.internalServer, err.message);
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
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const agentList = await Agent.find(findQuery).sort({ agentCode: -1 }).limit(limit).skip(page).populate('studentId', { name: 1, email: 1, mobileNumber: 1 }).populate('adminId', { name: 1, shortName: 1 })

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
        response(req, res, activity, 'Level-1', 'CSV-File-Insert-Database for agent module', true, 200, { agentList }, 'Successfully CSV File Store Into Database');
    } catch (err) {
        console.error(err);
        response(req, res, activity, 'Level-3', 'CSV-File-Insert-Database for agent module', false, 500, {}, 'Internal Server Error', err.message);
    }
};


export let activeAgent = async (req, res, next) => {
    try {
        const agentIds = req.body.agentIds; 

        const agents = await Agent.updateMany(
            { _id: { $in: agentIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );

        if (agents.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-Agent', true, 200, agents, 'Successfully Activated Agent.');
        } else {
            response(req, res, activity, 'Level-3', 'Active-Agent', false, 400, {}, 'Already Agent were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-Agent', false, 500, {}, 'Internal Server Error', err.message);
    }
};


export let deactivateAgent = async (req, res, next) => {
    try {
        const agentIds = req.body.agentIds;  
      const agents = await Agent.updateMany(
        { _id: { $in: agentIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (agents.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-Agent', true, 200, agents, 'Successfully deactivated Agent.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-Agent', false, 400, {}, 'Already Agent were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-Agent', false, 500, {}, 'Internal Server Error', err.message);
    }
  };



  export let assignStaffId = async (req, res, next) => {
    try {
        const { Ids, staffId,staffName } = req.body;  


        const user = await Agent.updateMany(
            { _id: { $in: Ids } }, 
            { $set: { staffId: staffId , staffName:staffName } }, 
            { new: true }
        );

        if (user.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Assign staff', true, 200, user, 'Successfully assigned staff');
        } else {
            response(req, res, activity, 'Level-3', 'Assign staff', false, 400, {}, 'No staff were assigned.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Assign staff', false, 500, {}, 'Internal Server Error', err.message);
    }
};