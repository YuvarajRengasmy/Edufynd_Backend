import {StudentEnquiry,StudentEnquiryDocument} from "../model/studentEnquiry.model";
import { EnquiryStatus} from '../../setting/moduleSetting/model/studentEnquiryStatus.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import * as TokenManager from "../../utils/tokenManager";
import { response, transporter } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { format } from 'date-fns';
import * as config from '../../config';
import csv = require("csvtojson");
var activity = "StudentEnquiry";

export let getAllStudentEnquiry = async (req, res, next) => {
    try {
        const data = await StudentEnquiry.find({ isDeleted: false }).sort({studentCode: -1});
        response(req,res,activity,"Level-1","GetAll-StudentEnquiry",true,200,data,clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req,res,activity,"Level-3","GetAll-StudentEnquiry",false,500,{},errorMessage.internalServer,err.message);
    }
};

export let getSingleStudentEnquiry = async (req, res, next) => {
    try {
        const student = await StudentEnquiry.findOne({ _id: req.query._id });
        response(req,res,activity,"Level-1","Get-Single-StudentEnquiry",true,200,student,clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req,res,activity,"Level-3","Get-Single-StudentEnquiry",false,500,{},errorMessage.internalServer,err.message);
    }
};

export let getAllLoggedStudentEnquiry = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "StudentEnquiry" })
        response(req, res, activity, 'Level-1', 'All-Logged StudentEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged StudentEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedStudentEnquiry = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged StudentEnquiry', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged StudentEnquiry', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        return response(req, res, activity, 'Level-2', 'Single-Logged StudentEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


const generateNextStudentCode = async (): Promise<string> => {
    const student = await StudentEnquiry.find({}, "studentCode").exec();
    const maxCounter = student.reduce((max, app) => {
        const appCode = app.studentCode;
        const parts = appCode.split("_");
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10);
            return counter > max ? counter : max;
        }
        return max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, "0");
    // Return the new Applicantion Code
    return `SR_${formattedCounter}`;
};

export let createStudentEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const enquiryDetails: StudentEnquiryDocument = req.body;
            enquiryDetails.createdOn = new Date();
            enquiryDetails.studentCode = await generateNextStudentCode();

            // Fetch position and duration details from the ApplicationStatusDocument collection
            const nextDocument = await EnquiryStatus.find({});

            // Initialize estimateDate for each status
            let previousEstimateDate = new Date(); // Start with the current date for the first status

            if (enquiryDetails.status && enquiryDetails.status.length > 0) {
                enquiryDetails.status = enquiryDetails.status.map((status, index) => {

                    // Fetch the corresponding status details from ApplicationStatusDocument collection
                    const statusDetails = nextDocument.find((appStatus) => appStatus.position === status.position);

                    if (!statusDetails) {
                        throw new Error(`Status with position ${status.position} not found in the ApplicationStatus collection.`);
                    }

                    // For the first status (position 1), set the current date for both createdOn and estimateDate
                    if (statusDetails.position === 1) {
                        // For the first status (position 1), set estimateDate and createdOn to the current date
                        status.estimateDate = new Date(); // Set estimateDate to current date
                        status.createdOn = new Date(); // Set createdOn to current date
                        previousEstimateDate = status.estimateDate; // Set previousEstimateDate for the next position
                    } else {
                        const previousStatus = enquiryDetails.status.find(
                            (prevStatus) => prevStatus.position === (Number(statusDetails.position) - 1)
                        );
            
                        if (previousStatus) {
                            const previousDurationInDays = Number(previousStatus.duration) || 0;
                            const previousEstimate = new Date(previousStatus.estimateDate);
                            status.estimateDate = new Date(previousEstimate.setDate(previousEstimate.getDate() + previousDurationInDays));
                        } 
                    }

                    // Set other fields like position and duration
                    status.position = statusDetails.position;
                    status.duration = statusDetails.duration;
                    
                    return status
                });
            }


            const createData = new StudentEnquiry(enquiryDetails);
            let insertData = await createData.save();

            response(req, res,activity,"Level-2","StudentEnquiry-Created",true,200,insertData,clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req,res,activity,"Level-3","StudentEnquiry-Created",false,500,{},errorMessage.internalServer,err.message);
        }
    } else {
        response(req,res,activity,"Level-3","StudentEnquiry-Created",false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()));
    }
};

export let updateStudentEnquiryy = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentEnquiryDetails: StudentEnquiryDocument = req.body;
            const updateData = await StudentEnquiry.findOneAndUpdate(
                { _id: req.body._id },
                {
                    $set: {
                        source: studentEnquiryDetails.source,
                        name: studentEnquiryDetails.name,
                        dob: studentEnquiryDetails.dob,
                        passportNo: studentEnquiryDetails.passportNo,
                        qualification: studentEnquiryDetails.qualification,
                        whatsAppNumber: studentEnquiryDetails.whatsAppNumber,
                        primaryNumber: studentEnquiryDetails.primaryNumber,
                        email: studentEnquiryDetails.email,
                        cgpa: studentEnquiryDetails.cgpa,
                        yearPassed: studentEnquiryDetails.yearPassed,
                        desiredCountry: studentEnquiryDetails.desiredCountry,
                        desiredCourse: studentEnquiryDetails.desiredCourse,
                        doYouNeedSupportForLoan:
                            studentEnquiryDetails.doYouNeedSupportForLoan,
                        assignedTo: studentEnquiryDetails.assignedTo,
                        message: studentEnquiryDetails.message,

                        // New Added Field
                        gender: studentEnquiryDetails.gender,
                        citizenShip: studentEnquiryDetails.citizenShip,
                        expiryDate: studentEnquiryDetails.expiryDate,
                        desiredUniversity: studentEnquiryDetails.desiredUniversity,
                        doYouHoldAnyOtherOffer:
                            studentEnquiryDetails.doYouHoldAnyOtherOffer,
                        country: studentEnquiryDetails.country,
                        universityName: studentEnquiryDetails.universityName,
                        programName: studentEnquiryDetails.programName,
                        refereeName: studentEnquiryDetails.refereeName,
                        refereeContactNo: studentEnquiryDetails.refereeContactNo,
                        registerForIELTSClass: studentEnquiryDetails.registerForIELTSClass,
                        studentId: studentEnquiryDetails.studentId,
                        studentName: studentEnquiryDetails.studentName,
                        agentName: studentEnquiryDetails.agentName,
                        businessName: studentEnquiryDetails.businessName,
                        agentPrimaryNumber: studentEnquiryDetails.agentPrimaryNumber,
                        agentWhatsAppNumber: studentEnquiryDetails.agentWhatsAppNumber,
                        agentEmail: studentEnquiryDetails.agentEmail,
                        dial: studentEnquiryDetails.dial,
                        dial1: studentEnquiryDetails.dial1,
                        dial2: studentEnquiryDetails.dial2,
                        dial3: studentEnquiryDetails.dial3,
                        dial4: studentEnquiryDetails.dial4,

                        modifiedOn: new Date(),
                        modifiedBy: studentEnquiryDetails.modifiedBy,
                    },
                }
            );
            response(req,res,activity,
                "Level-2",
                "Update-studentEnquiryDetails",
                true,
                200,
                updateData,
                clientError.success.updateSuccess
            );
        } catch (err: any) {
            response(
                req,
                res,
                activity,
                "Level-3",
                "Update-studentEnquiryDetails",
                false,
                500,
                {},
                errorMessage.internalServer,
                err.message
            );
        }
    } else {
        response(
            req,
            res,
            activity,
            "Level-3",
            "Update-studentEnquiryDetails",
            false,
            422,
            {},
            errorMessage.fieldValidation,
            JSON.stringify(errors.mapped())
        );
    }
};

export let deleteStudentEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const student = await StudentEnquiry.findByIdAndDelete({ _id: id });

        response(
            req,
            res,
            activity,
            "Level-2",
            "Delete-student Enquiry Details",
            true,
            200,
            student,
            "Successfully Remove student Enquiry Details"
        );
    } catch (err: any) {
        response(
            req,
            res,
            activity,
            "Level-3",
            "Delete-student Enquiry Details",
            false,
            500,
            {},
            errorMessage.internalServer,
            err.message
        );
    }
};

export let getFilteredStudentEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        // andList.push({ status: 1 });
        if (req.body.studentCode) {
            andList.push({ studentCode: req.body.studentCode });
        }
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId });
        }
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId });
        }
        if (req.body.name) {
            andList.push({ name: req.body.name });
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo });
        }
        if (req.body.email) {
            andList.push({ email: req.body.email });
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber });
        }

        findQuery = andList.length > 0 ? { $and: andList } : {};

        const studentList = await StudentEnquiry.find(findQuery)
            .sort({ studentCode: -1 })
            .limit(limit)
            .skip(page).populate('staffId').populate('adminId');

        const studentCount = await StudentEnquiry.find(findQuery).count();
        response(
            req,
            res,
            activity,
            "Level-1",
            "Get-FilterStudentEnquiry",
            true,
            200,
            { studentList, studentCount },
            clientError.success.fetchedSuccessfully
        );
    } catch (err: any) {
        response(
            req,
            res,
            activity,
            "Level-3",
            "Get-FilterStudentEnquiry",
            false,
            500,
            {},
            errorMessage.internalServer,
            err.message
        );
    }
};



export let activeStudentEnquiry = async (req, res, next) => {
    try {
        const studentEnquiryIds = req.body.studentEnquiryIds; 
  
        const student = await StudentEnquiry.updateMany(
            { _id: { $in: studentEnquiryIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (student.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-StudentEnquiry ', true, 200, student, 'Successfully Activated StudentEnquiry .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-StudentEnquiry ', false, 400, {}, 'Already StudentEnquiry were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-StudentEnquiry ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateStudentEnquiry = async (req, res, next) => {
    try {
        const studentEnquiryIds = req.body.studentEnquiryIds;   
      const student = await StudentEnquiry.updateMany(
        { _id: { $in: studentEnquiryIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (student.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-StudentEnquiry', true, 200, student, 'Successfully deactivated StudentEnquiry.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-StudentEnquiry', false, 400, {}, 'Already StudentEnquiry were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-StudentEnquiry', false, 500, {}, 'Internal Server Error', err.message);
    }
  };


  export let assignStaffId = async (req, res, next) => {
    try {
        const { studentEnquiryIds, staffId,staffName } = req.body;  // Destructure studentEnquiryIds and staffId from the request body

        // Update all student enquiries with the selected staffId
        const student = await StudentEnquiry.updateMany(
            { _id: { $in: studentEnquiryIds } },  // Find student enquiries by IDs
            { $set: { staffId: staffId , staffName:staffName } },       // Set the staffId field
            { new: true }
        );

        if (student.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Assign staff', true, 200, student, 'Successfully assigned staff');
        } else {
            response(req, res, activity, 'Level-3', 'Assign staff', false, 400, {}, 'No staff were assigned.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Assign staff', false, 500, {}, 'Internal Server Error', err.message);
    }
};



const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};


export let updateStudentEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentEnquiryDetails: StudentEnquiryDocument = req.body;
            const application = await StudentEnquiry.findOne({ $and: [{ _id: { $ne: studentEnquiryDetails._id } }, { email: studentEnquiryDetails.email }] });

            if (!application) {
                const updateMaster = new StudentEnquiry(studentEnquiryDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
                        $set: {
                            source: studentEnquiryDetails.source,
                            name: studentEnquiryDetails.name,
                            dob: studentEnquiryDetails.dob,
                            passportNo: studentEnquiryDetails.passportNo,
                            qualification: studentEnquiryDetails.qualification,
                            whatsAppNumber: studentEnquiryDetails.whatsAppNumber,
                            primaryNumber: studentEnquiryDetails.primaryNumber,
                            email: studentEnquiryDetails.email,
                            cgpa: studentEnquiryDetails.cgpa,
                            yearPassed: studentEnquiryDetails.yearPassed,
                            desiredCountry: studentEnquiryDetails.desiredCountry,
                            desiredCourse: studentEnquiryDetails.desiredCourse,
                            doYouNeedSupportForLoan:
                                studentEnquiryDetails.doYouNeedSupportForLoan,
                            assignedTo: studentEnquiryDetails.assignedTo,
                            message: studentEnquiryDetails.message,
    
                            // New Added Field
                            gender: studentEnquiryDetails.gender,
                            citizenShip: studentEnquiryDetails.citizenShip,
                            expiryDate: studentEnquiryDetails.expiryDate,
                            desiredUniversity: studentEnquiryDetails.desiredUniversity,
                            doYouHoldAnyOtherOffer:
                                studentEnquiryDetails.doYouHoldAnyOtherOffer,
                            country: studentEnquiryDetails.country,
                            universityName: studentEnquiryDetails.universityName,
                            programName: studentEnquiryDetails.programName,
                            refereeName: studentEnquiryDetails.refereeName,
                            refereeContactNo: studentEnquiryDetails.refereeContactNo,
                            registerForIELTSClass: studentEnquiryDetails.registerForIELTSClass,
                            studentId: studentEnquiryDetails.studentId,
                            studentName: studentEnquiryDetails.studentName,
                            agentName: studentEnquiryDetails.agentName,
                            businessName: studentEnquiryDetails.businessName,
                            agentPrimaryNumber: studentEnquiryDetails.agentPrimaryNumber,
                            agentWhatsAppNumber: studentEnquiryDetails.agentWhatsAppNumber,
                            agentEmail: studentEnquiryDetails.agentEmail,
                            dial: studentEnquiryDetails.dial,
                            dial1: studentEnquiryDetails.dial1,
                            dial2: studentEnquiryDetails.dial2,
                            dial3: studentEnquiryDetails.dial3,
                            dial4: studentEnquiryDetails.dial4,
    
                            modifiedOn: new Date(),
                            modifiedBy: studentEnquiryDetails.modifiedBy,
                        },
                        $addToSet: {
                            status: studentEnquiryDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await StudentEnquiry.findById(studentEnquiryDetails._id);
                const user = updatedApplication.studentName
                const statusLength = updatedApplication.status.length;
                const currentDate = new Date();
                let delayMessages = []; // Array to store all delay messages

                if (statusLength > 1) {
                    for (let i = 0; i < statusLength - 1; i++) {
                        const statusCreatedOn = new Date(updatedApplication.status[i].createdOn);
                        const statusDurationInMs = Number(updatedApplication.status[i + 1].duration) * 24 * 60 * 60 * 1000;
                        const expectedCompletionDate = new Date(statusCreatedOn.getTime() + statusDurationInMs);

                        if (currentDate > expectedCompletionDate) {
                            const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));
                            delayMessages.push(`Delayed by ${delayDays} day(s) for status updated on ${statusCreatedOn.toDateString()}`);
                        }
                    }
                } else if (statusLength === 1) {
                    const applicationCreatedDate = new Date(updatedApplication.createdOn);
                    const lastStatus = updatedApplication.status[0];
                    const statusDurationInMs = Number(lastStatus.duration) * 24 * 60 * 60 * 1000;
                    const expectedCompletionDate = new Date(applicationCreatedDate.getTime() + statusDurationInMs);

                    if (currentDate > expectedCompletionDate) {
                        const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));
                        delayMessages.push(`Delayed by ${delayDays} day(s) for initial application created on ${applicationCreatedDate.toDateString()}`);
                    }
                }

                const lastStatus = updatedApplication.status[statusLength - 1];
                const sanitizedContent = lastStatus.commentBox
                const docs = lastStatus.document;
                const Message = delayMessages[delayMessages.length - 1]
                const delayMessage = Message ? Message : "No Delay"

                // Update last status with delay message in the database
                await updatedApplication.updateOne({
                    $set: {
                        "status.$[elem].delay": delayMessage,
                        "status.$[elem].createdBy": user,
                        "status.$[statusElem].reply.$[replyElem].replyMessage": req.body.replyMessage,

                    }
                }, {
                    arrayFilters: [
                        // { "statusElem._id": req.body.statusId }, // Match the status by its _id
                        { "elem._id": lastStatus._id },
                        { "replyElem._id": req.body.replyId },   // Match the reply by its _id
                    ],

                });

                // Prepare email attachments
                const attachments = [];
                   let cid = ''
                if (docs) {
                    const [fileType, fileContent] = docs.split("base64,");
                    const extension = fileType ?? fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                    const timestamp = format(new Date(), 'yyyyMMdd');
                    const dynamicFilename = `${sanitizedContent.replace(/\s+/g, '_')}_${timestamp}.${extension}`;
                    cid = `image_${Date.now()}.${extension}`; // Create a unique CID for the image

                    attachments.push({
                        filename: dynamicFilename,
                        content: docs.split("base64,")[1],
                        encoding: 'base64',
                        cid: cid
                    });
                }

                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: updatedApplication.email,
                    subject: "Student Enquiry Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                            Student Enquiry Status Updated
                                                          </td>
                                                      </tr>
                          
                                                      <!-- Body -->
                                                      <tr>
                                                          <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                              <p>Hello ${updatedApplication.studentName},</p>
                                                              <p>Your application status has been updated.</p>
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${lastStatus.statusName}</p>
                                                              <p>Comment: ${sanitizedContent}</p>
                                                                 <p>Delayed: ${delayMessage}</p>
        
                                                             ${cid? `<img src="cid:${cid}" alt="Image" width="500" height="300" />` : ''}
          
                                                              <p>This information is for your reference.</p>
                                                              <p>Team,<br>Edufynd Private Limited,<br>Chennai.</p>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                  <td style="padding: 30px 40px 30px 40px; text-align: center;">
                                      <!-- CTA Button -->
                                      <table cellspacing="0" cellpadding="0" style="margin: auto;">
                                          <tr>
                                              <td align="center" style="background-color: #345C72; padding: 10px 20px; border-radius: 5px;">
                                                  <a href="https://crm.edufynd.in/" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">Book a Free Consulatation</a>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          
                                                      <!-- Footer -->
                                                      <tr>
                                                          <td class="footer" style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                                                             Copyright &copy; ${new Date().getFullYear()} | All rights reserved
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </body>
                              `,
                              attachments: attachments
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email' });
                    } else {
                        console.log('Email sent:', info.response);
                        res.status(201).json({ message: 'You have received a Loan Enquiry Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Student Enquiry status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'Student Enquiry not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Student Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Student Enquiry', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updateStatus = async (req, res) => {
    try {
        const { 
            statusId, statusName, progress, subCategory, completed, 
            duration, position, category, commentBox, document, reply 
        } = req.body;

        const sanitizedReply = Array.isArray(reply)
            ? reply.map(item => ({
                replyMessage: stripHtmlTags(item.replyMessage || ""),
          
            }))
            : [{ replyMessage: stripHtmlTags(reply || "")}];

        // Step 1: Set other status fields
        const updateResult = await StudentEnquiry.findOneAndUpdate(
            { _id: req.body._id, "status._id": statusId },
            {
                $set: {
                    "status.$[elem].statusName": statusName,
                    "status.$[elem].progress": progress,
                    "status.$[elem].duration": duration,
                    "status.$[elem].subCategory": subCategory,
                    "status.$[elem].category": category,
                    "status.$[elem].position": position,
                    "status.$[elem].completed": completed,
                    "status.$[elem].commentBox": commentBox,
                    "status.$[elem].document": document,
                    "status.$[elem].modifiedOn": new Date(),
                }
            },
            {
                arrayFilters: [{ "elem._id": statusId }],
                new: true,
                runValidators: true
            }
        );

        if (!updateResult) {
            return res.status(404).json({ message: 'Status not found' });
        }

        // Step 2: Push the reply to the status reply array
        const pushResult = await StudentEnquiry.findOneAndUpdate(
            { _id: req.body._id, "status._id": statusId },
            { $push: { "status.$.reply": { $each: sanitizedReply } } },
            { new: true }
        );

        if (!pushResult) {
            return res.status(404).json({ message: 'Failed to add reply.' });
        }

        // Return success response
        res.status(200).json({ message: 'Status updated successfully', data: pushResult });

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};