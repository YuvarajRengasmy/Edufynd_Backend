import { Applicant, ApplicantDocument } from '../model/application.model'
import { Logs } from "../model/logs.model";
import { Program, ProgramDocument } from '../model/program.model'
import { Student, StudentDocument } from '../model/student.model'
import { University, UniversityDocument } from '../model/university.model'
import { validationResult } from "express-validator";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as config from '../config';
import { closestIndexTo, format } from 'date-fns';


var activity = "Applicant";


export let getAllApplicant = async (req, res, next) => {
    try {
        const data = await Applicant.find({ isDeleted: false }).sort({ applicationCode: -1 });
        response(req, res, activity, 'Level-1', 'GetAll-Applicant', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getAllLoggedApplication= async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Applicant" })
        response(req, res, activity, 'Level-1', 'All-Logged Applicant', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleLoggedApplicant = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged Applicant', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged Applicant', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }

export let getAllApplicantCardDetails = async (req, res, next) => {
    try {
        // Find all client that are not deleted
        const totalApplication = await Applicant.find().count()
    

        // Active and inactive universities
        const activeClient = await Applicant.countDocuments({ isActive: "Active"});
        const inactiveClient = await Applicant.countDocuments({isActive: "InActive" });


        const topUniversities = await Applicant.aggregate([
            { $match: { isActive: "Active" } }, // Match documents that are not deleted
            { $group: { _id: "$universityName", count: { $sum: 1 } } }, // Group by universityName and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order
            { $limit: 3 }, // Limit to top 3 universities
            { $project: { _id: 0, universityName: "$_id", count: 1 } } // Project the result with universityName and count
        ]);

        
        const topCountry = await Applicant.aggregate([
            { $match: { isActive: "Active" } }, // Match documents that are not deleted
            { $group: { _id: "$uniCountry", count: { $sum: 1 } } }, // Group by universityName and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order
            { $limit: 3 }, // Limit to top 3 universities
            { $project: { _id: 0, uniCountry: "$_id", count: 1 } } // Project the result with universityName and count
        ]);

        // Construct the response data
        const responseData = {
            totalApplication,
            activeClient,
            inactiveClient, 
            topUniversities,
            topCountry
        };

        // Send the response
        response(req, res, activity, 'Level-1', 'GetAll-Application Card Details', true, 200, responseData, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Application Card Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getSingleApplicant = async (req, res, next) => {
    try {
        const applicant = await Applicant.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Applicant', true, 200, applicant, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



const generateNextApplicationCode = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const applicant = await Applicant.find({}, 'applicationCode').exec();
    const maxCounter = applicant.reduce((max, app) => {
        const appCode = app.applicationCode;
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
    return `AP_${formattedCounter}`;
};


export let createApplicant = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            // Generate the next client ID
            applicantDetails.applicationCode = await generateNextApplicationCode();
            const createData = new Applicant(applicantDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Save-Applicant', 'Level-2', true, 200, insertData, clientError.success.application);
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Save-Applicant', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Save-Applicant', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const courseApply = async (req, res) => {
    try {

        const programDetails: ProgramDocument = req.body;
        const applicantDetails: ApplicantDocument = req.body;

        // Fetch the programTitle based on country and universities
        const programTitle = await Program.find({ country: applicantDetails.country, universityName: { $in: [applicantDetails.universityName] } });

        if (programTitle.length === 0) {
            return res.status(404).json({ message: 'No program found for the selected country and universityName' });
        }
        // Assuming the applicant selects a university from the filtered list
        const selectedProgram = programTitle[0];
        applicantDetails.applicationCode = await generateNextApplicationCode();
        // Create the applicant document
        const newApplicant = new Applicant({
            ...applicantDetails, programTitle: selectedProgram.programTitle,
            course: selectedProgram.courseType,
        });
        // Save the applicant document to the database
        await newApplicant.save();
        res.status(201).json({ message: 'Application created successfully', applicant: newApplicant });
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export const createApplicanttt = async (req, res) => {
    try {
        const applicantDetails: ApplicantDocument = req.body;


        // Fetch the universities based on country and intake
        const universities = await University.find({ country: applicantDetails.country, inTake: { $in: [applicantDetails.inTake] } });

        if (universities.length === 0) {
            return res.status(404).json({ message: 'No universities found for the selected country and intake' });
        }

        // Assuming the applicant selects a university from the filtered list
        const selectedUniversity = universities[0];
        applicantDetails.applicationCode = await generateNextApplicationCode();
        // Create the applicant document
        const newApplicant = new Applicant({ ...applicantDetails, universityName: selectedUniversity.universityName });

        // Save the applicant document to the database
        await newApplicant.save();

        res.status(201).json({ message: 'Application created successfully', applicant: newApplicant });
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};

export let updateApplicant = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            const application = await Applicant.findOne({ $and: [{ _id: { $ne: applicantDetails._id } }, { email: applicantDetails.email }] });

            if (!application) {
                const updateMaster = new Applicant(applicantDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
                        $set: {
                            name: applicantDetails.name,
                            dob: applicantDetails.dob,
                            passportNo: applicantDetails.passportNo,
                            email: applicantDetails.email,
                            primaryNumber: applicantDetails.primaryNumber,
                            whatsAppNumber: applicantDetails.whatsAppNumber,
                            inTake: applicantDetails.inTake,
                            universityName: applicantDetails.universityName,
                            campus: applicantDetails.campus,
                            course: applicantDetails.course,
                            courseFees: applicantDetails.courseFees,
                            anyVisaRejections: applicantDetails.anyVisaRejections,
                            feesPaid: applicantDetails.feesPaid,
                            assignTo: applicantDetails.assignTo,
                            country: applicantDetails.country,
                            uniCountry: applicantDetails.uniCountry,
                            modifiedOn: new Date(),
                            modifiedBy: applicantDetails.modifiedBy,
                        },
                        $addToSet: {
                            status: applicantDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await Applicant.findById(applicantDetails._id);
                const user = updatedApplication.name
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
                const sanitizedContent = stripHtmlTags(lastStatus.commentBox);
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
                    subject: "Application Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                              Application Status Updated
                                                          </td>
                                                      </tr>
                          
                                                      <!-- Body -->
                                                      <tr>
                                                          <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                              <p>Hello ${updatedApplication.name},</p>
                                                              <p>Your application status has been updated.</p>
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${lastStatus.newStatus}</p>
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
                                                              Copyright &copy; 2024 | All rights reserved
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
                        res.status(201).json({ message: 'You have received a Application Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Application status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'Applicant not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export let deleteApplicant = async (req, res, next) => {

    try {
        const applicant = await Applicant.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-2', 'Delete-Applicant', true, 200, applicant, 'Successfully Remove Applicant');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredApplication = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        // andList.push({ status: 1 })
        if (req.body.name) {
            andList.push({ name: req.body.name })
        }
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId })
        }
       
        if (req.body.agentId) {
            andList.push({ agentId: req.body.agentId })
        }
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId })
        }
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId })
        }
        if (req.body.feesPaid) {
            andList.push({ feesPaid: req.body.feesPaid })
        }
        if (req.body.anyVisaRejections) {
            andList.push({ anyVisaRejections: req.body.anyVisaRejections })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const applicantList = await Applicant.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)

        const applicantCount = await Applicant.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterApplicant', true, 200, { applicantList, applicantCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterApplicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


///////

export let updateApplicantt = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            const application = await Applicant.findOne({ $and: [{ _id: { $ne: applicantDetails._id } }, { email: applicantDetails.email }] });

            if (!application) {
                const updateMaster = new Applicant(applicantDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
                        $set: {
                            name: applicantDetails.name,
                            dob: applicantDetails.dob,
                            passportNo: applicantDetails.passportNo,
                            email: applicantDetails.email,
                            primaryNumber: applicantDetails.primaryNumber,
                            whatsAppNumber: applicantDetails.whatsAppNumber,
                            inTake: applicantDetails.inTake,
                            universityName: applicantDetails.universityName,
                            campus: applicantDetails.campus,
                            course: applicantDetails.course,
                            courseFees: applicantDetails.courseFees,
                            anyVisaRejections: applicantDetails.anyVisaRejections,
                            feesPaid: applicantDetails.feesPaid,
                            assignTo: applicantDetails.assignTo,
                            country: applicantDetails.country,
                            modifiedOn: new Date(),
                            modifiedBy: applicantDetails.modifiedBy,
                        },
                        $addToSet: {
                            status: applicantDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await Applicant.findById(applicantDetails._id);
                const user = updatedApplication.name
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
                const sanitizedContent = stripHtmlTags(lastStatus.commentBox);
                const docs = lastStatus.document;
                const Message = delayMessages[delayMessages.length - 1]
                const delayMessage = Message ? Message : "No Delay"

                // Update last status with delay message in the database
                await updatedApplication.updateOne({
                    $set: {
                        "status.$[elem].delay": delayMessage,
                        "status.$[elem].createdBy": user
                    }
                }, {
                    arrayFilters: [{ "elem._id": lastStatus._id }]
                });

                // Prepare email attachments
                const attachments = [];
                let cid = ''
                if (docs) {
                    const [fileType, fileContent] = docs.split("base64,");
                    const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
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
                    subject: "Application Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                              Application Status Updated
                                                          </td>
                                                      </tr>
                          
                                                      <!-- Body -->
                                                      <tr>
                                                          <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                              <p>Hello ${updatedApplication.name},</p>
                                                              <p>Your application status has been updated.</p>
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${lastStatus.newStatus}</p>
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
                                                              Copyright &copy; 2024 | All rights reserved
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
                        res.status(201).json({ message: 'You have received a Application Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Application status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'Applicant not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const getStudentApplication = async (req, res) => {
    try {

        const data = await Applicant.find({ studentId: req.query.studentId })

        response(req, res, activity, 'Level-1', 'GetSingle-Application', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Application', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let activeApplicant = async (req, res, next) => {
    try {
        const applicantIds = req.body.applicantIds; 

        const applicants = await Applicant .updateMany(
            { _id: { $in: applicantIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );

        if (applicants.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-Applicant ', true, 200, applicants, 'Successfully Activated Applicant .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-Applicant ', false, 400, {}, 'Already Applicant  were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-Applicant ', false, 500, {}, 'Internal Server Error', err.message);
    }
};


export let deactivateApplicant = async (req, res, next) => {
    try {
        const applicantIds = req.body.applicantIds;   
      const applicants = await Applicant.updateMany(
        { _id: { $in: applicantIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (applicants.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-Applicant', true, 200, applicants, 'Successfully deactivated Applicant.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-Applicant', false, 400, {}, 'Already Applicant were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-Applicant', false, 500, {}, 'Internal Server Error', err.message);
    }
  };

  
  export let assignStaffId = async (req, res, next) => {
    try {
        const { Ids, staffId,staffName } = req.body;  
        const user = await Applicant.updateMany(
            { _id: { $in: Ids } }, 
            { $set: { staffId: staffId , staffName:staffName } }
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