import { Applicant, ApplicantDocument } from '../model/application.model'
import { Program, ProgramDocument } from '../model/program.model'
import { Student, StudentDocument } from '../model/student.model'
import { University, UniversityDocument } from '../model/university.model'
import { validationResult } from "express-validator";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as config from '../config';
import { format } from 'date-fns';


var activity = "Applicant";


export let getAllApplicant = async (req, res, next) => {
    try {
        const data = await Applicant.find({ isDeleted: false }).sort({ applicationCode: -1 });
        response(req, res, activity, 'Level-1', 'GetAll-Applicant', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
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
        const newApplicant = new Applicant({ ...applicantDetails, programTitle: selectedProgram.programTitle,
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

                // Prepare email attachments
                const attachments = [];
                if (docs) {
                    const [fileType, fileContent] = docs.split("base64,");
                    const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                    const timestamp = format(new Date(), 'yyyyMMdd');
                    const dynamicFilename = `${sanitizedContent.replace(/\s+/g, '_')}_${timestamp}.${extension}`;

                    attachments.push({
                        filename: dynamicFilename,
                        content: docs.split("base64,")[1],
                        encoding: 'base64'
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
                                                            <img src=${docs} alt="Image" width="500" height="300" />
          
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



/**
 * @author Balan K K
 * @date 28-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter Staff Details
 */

export let getFilteredApplication = async (req, res, next) => {
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
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.feesPaid) {
            andList.push({ feesPaid: req.body.feesPaid })
        }
        if (req.body.anyVisaRejections) {
            andList.push({ anyVisaRejections: req.body.anyVisaRejections })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const applicantList = await Applicant.find(findQuery).sort({ applicationCode: -1 }).limit(limit).skip(page)

        const applicantCount = await Applicant.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterApplicant', true, 200, { applicantList, applicantCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterApplicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


///////

export let updateApplicantcorrectedcode = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            const application = await Applicant.findOne({ $and: [{ _id: { $ne: applicantDetails._id } }, { email: applicantDetails.email }] });
            console.log("uu", application)
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

                // Find the updated applicant to fetch the updated status array
                const updatedApplication = await Applicant.findById(applicantDetails._id);
                console.log("123", updatedApplication)
                const statusLength = updatedApplication.status.length;
                const applicationCreatedDate = new Date(updatedApplication.createdOn);
                const currentDate = new Date();

                let delayMessage = '';
                if (statusLength > 1) {
                    console.log("length > 1", statusLength)

                    for (let i = 0; i < statusLength - 1; i++) {
                        const statusCreatedOn = new Date(updatedApplication.status[i].createdOn);
                        console.log("000", statusCreatedOn)
                        const statusDurationInMs = Number(updatedApplication.status[i + 1].duration) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
                        const expectedCompletionDate = new Date(statusCreatedOn.getTime() + statusDurationInMs);
                        console.log("111", expectedCompletionDate)
                        const nextStatusCreatedOn = new Date(updatedApplication.status[i + 1].createdOn);

                        if (currentDate > expectedCompletionDate) {
                            const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));
                            delayMessage = `Delayed by ${delayDays} day(s)`;
                            console.log("lenggg", delayMessage)
                        }
                    }
                } else {
                    console.log("length <0")
                    const last = updatedApplication.status[(updatedApplication.status).length - 1]
                    const duration = last.duration
                    const statusDurationInMs = Number(duration) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
                    const expectedCompletionDate = new Date(applicationCreatedDate.getTime() + statusDurationInMs);
                    console.log("compl", expectedCompletionDate)

                    let delayMessage = '';
                    if (currentDate > expectedCompletionDate) {
                        const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));

                        delayMessage = `Delayed by ${delayDays} day(s)`;
                        console.log("44", delayMessage)
                    }
                }

                const lastStatus = updatedApplication.status[statusLength - 1];
                const lastComment = lastStatus.commentBox;
                const sanitizedContent = stripHtmlTags(lastComment);
                const docs = lastStatus.document;

                // Prepare email attachments
                const attachments = [];
                if (docs) {
                    const [fileType, fileContent] = docs.split("base64,");
                    const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                    const timestamp = format(new Date(), 'yyyyMMdd');
                    const dynamicFilename = `${sanitizedContent.replace(/\s+/g, '_')}_${timestamp}.${extension}`;

                    attachments.push({
                        filename: dynamicFilename,
                        content: docs.split("base64,")[1],
                        encoding: 'base64'
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
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${lastStatus}</p>
                                                              <p>Comment: ${sanitizedContent}</p>
                                                                 <p>Delayed: ${delayMessage}</p>
                                                            <img src=${docs} alt="Image" width="500" height="300" />
          
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



export let updateApplicantsecondoriginal = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            const application = await Applicant.findOne({ $and: [{ _id: { $ne: applicantDetails._id } }, { email: applicantDetails.email }] });
            console.log("uu", application)
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

                // Find the updated applicant to fetch the updated status array
                const updatedApplication = await Applicant.findById(applicantDetails._id);
                console.log("123", updatedApplication)
                const statusLength = updatedApplication.status.length;
                const applicationCreatedDate = new Date(updatedApplication.createdOn);
                const currentDate = new Date();

                let delayMessage = '';
                if (statusLength > 1) {
                    console.log("length > 1", statusLength)

                    for (let i = 0; i < statusLength - 1; i++) {
                        const statusCreatedOn = new Date(updatedApplication.status[i].createdOn);
                        console.log("000", statusCreatedOn)
                        console.log("dura", updatedApplication.status[i + 1].duration)
                        const statusDurationInMs = Number(updatedApplication.status[i + 1].duration) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
                        const expectedCompletionDate = new Date(statusCreatedOn.getTime() + statusDurationInMs);
                        console.log("111", expectedCompletionDate)


                        if (currentDate > expectedCompletionDate) {
                            const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));
                            delayMessage = `Delayed by ${delayDays} day(s)`;
                            console.log("lenggg", delayMessage)
                        }
                    }
                } else {
                    console.log("length <0")
                    const last = updatedApplication.status[(updatedApplication.status).length - 1]
                    const duration = last.duration
                    const statusDurationInMs = Number(duration) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
                    const expectedCompletionDate = new Date(applicationCreatedDate.getTime() + statusDurationInMs);
                    console.log("compl", expectedCompletionDate)

                    let delayMessage = '';
                    if (currentDate > expectedCompletionDate) {
                        const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));

                        delayMessage = `Delayed by ${delayDays} day(s)`;
                        console.log("44", delayMessage)
                    }
                }

                const lastStatus = updatedApplication.status[statusLength - 1];
                const lastComment = lastStatus.commentBox;
                const sanitizedContent = stripHtmlTags(lastComment);
                const docs = lastStatus.document;

                // Prepare email attachments
                const attachments = [];
                if (docs) {
                    const [fileType, fileContent] = docs.split("base64,");
                    const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                    const timestamp = format(new Date(), 'yyyyMMdd');
                    const dynamicFilename = `${sanitizedContent.replace(/\s+/g, '_')}_${timestamp}.${extension}`;

                    attachments.push({
                        filename: dynamicFilename,
                        content: docs.split("base64,")[1],
                        encoding: 'base64'
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
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${lastStatus}</p>
                                                              <p>Comment: ${sanitizedContent}</p>
                                                                 <p>Delayed: ${delayMessage}</p>
                                                            <img src=${docs} alt="Image" width="500" height="300" />
          
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




export let updateApplicantfirstoriginal = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            const application = await Applicant.findOne({ $and: [{ _id: { $ne: applicantDetails._id } }, { email: applicantDetails.email }] });
            console.log("uu", application)
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

                // Find the updated applicant to fetch the updated status array
                const updatedApplication = await Applicant.findById(applicantDetails._id);
                console.log("55", updatedApplication)

                const last = updatedApplication.status[(updatedApplication.status).length - 1]
                const laststatus = last.newStatus;
                const lastComment = last.commentBox;
                const sanitizedContent = stripHtmlTags(lastComment);
                const docs = last.document

                // Prepare email attachments
                const attachments = [];
                if (docs) {
                    const [fileType, fileContent] = docs.split("base64,");
                    const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                    const timestamp = format(new Date(), 'yyyyMMdd');
                    const dynamicFilename = `${sanitizedContent.replace(/\s+/g, '_')}_${timestamp}.${extension}`;

                    attachments.push({
                        filename: dynamicFilename,
                        content: docs.split("base64,")[1],
                        encoding: 'base64'
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
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${laststatus}</p>
                                                              <p>Comment: ${sanitizedContent}</p>
                                                            <img src=${docs} alt="Image" width="500" height="300" />
          
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




