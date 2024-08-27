import { Meeting, MeetingDocument } from './meeting.model'
import { Student} from '../model/student.model'
import { Staff} from '../model/staff.model'
import { Admin} from '../model/admin.model'
import { Agent} from '../model/agent.model'
import { validationResult } from "express-validator";
import { response, transporter} from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as config from '../config';
import { format } from 'date-fns';


var activity = "Meeting";



export const getAllMeeting = async (req, res) => {
    try {
        const data = await Meeting.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Meeting', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Meeting', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleMeeting = async (req, res) => {
    try {
        const data = await Meeting.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Meeting', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Meeting', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};

export let createMeetingG = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const data:  MeetingDocument = req.body;
            const userName = req.body.attendees;// Array of selected usernames

            let users = [];

            // Fetch users based on typeOfUser
            if (data.hostName === 'student') {
                users = await Student.find({ name: { $in: userName } }, { name: 1, email: 1 });
            } else if (data.hostName === 'admin') {
                users = await Admin.find({ name: { $in: userName } }, { name: 1, email: 1 });
            } else if (data.hostName === 'agent') {
                users = await Agent.find({ agentName: { $in: userName } }, { agentName: 1, email: 1 });
            } else if (data.hostName === 'staff') {
                users = await Staff.find({ empName: { $in: userName } }, { empName: 1, email: 1 });
            }

            // Check if any users were found
            if (users.length > 0) {
                // Collect usernames and emails for the notification
                const userNames = users.map((user) => user.name || user.empName || user.agentName);
                const userEmails = users.map((user) => user.email);

                // Create a single notification document with all selected usernames and emails
                const meeting = new Meeting({...data,
                    userName: userNames,
                    userEmail: userEmails
                });

                // Save the promotion to the database
                const savedMeeting = await meeting.save();
                const sanitizedContent = stripHtmlTags(savedMeeting.content);

                // Send emails to all users
                const emailPromises = userEmails.map((email, index) => {
      
                    const mailOptions = {
                        from: config.SERVER.EMAIL_USER,
                        to: email,
                        subject: `${savedMeeting.subject}`,
                        html: `
                                      <body style="font-family: 'Poppins', Arial, sans-serif">
                                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                  <td align="center" style="padding: 20px;">
                                                      <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                          <!-- Header -->
                                                          <tr>
                                                              <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                              ${savedMeeting.subject}
                                                              </td>
                                                          </tr>
                              
                                                          <!-- Body -->
                                                          <tr>
                                                              <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                                  <p>Hello ${userNames[index]},</p>
                                                                  <p>Meeting Schedule Notification.</p>
                                                                  <p style="font-weight: bold,color: #345C72">Meeting Subject:  ${sanitizedContent}</p>
                                                                    <p style="font-weight: bold,color: #345C72">Meeting Date:  ${savedMeeting.date}</p>
                                                                      <p style="font-weight: bold,color: #345C72">Meeting Time:  ${savedMeeting.time}</p>
                                                           
                                                
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

                    // return transporter.sendMail(mailOptions);
                    transporter.sendMail(mailOptions, (error, info) => {

                        if (error) {
                            console.error('Error sending email:', error);
                            return res.status(500).json({ message: 'Error sending email' });
                        } else {
                            console.log('Email sent:', info.response);
                            res.status(201).json({ message: 'You have received a Meeting Notification'});
                        }
                    });
                });

                // Wait for all emails to be sent
                await Promise.all(emailPromises);

                response(req, res, activity, 'Level-1', 'Create-Meeting', true, 200, {}, "Meeting Notifications sent successfully by Email");
            } else {
                response(req, res, activity, 'Level-2', 'Create-Meeting', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
            response(req, res, activity, 'Level-3', 'Create-Meeting', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res,  activity, 'Level-3', 'Create-Meeting', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
    }
};

export const updateMeeting = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const meetingData: MeetingDocument = req.body;
            let statusData = await Meeting.findByIdAndUpdate({ _id:meetingData._id }, {
                $set: {
                    hostName: meetingData.hostName,
                    attendees: meetingData.attendees,
                    subject: meetingData.subject,
                    content: meetingData.content,
                    date: meetingData.date,
                    time: meetingData.time,

                    modifiedOn: new Date(),
                    modifiedBy: meetingData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-Meeting', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Meeting', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Meeting', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteMeeting = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await Meeting.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Meeting', true, 200, data, 'Successfully Remove Meeting');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Meeting', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredMeeting = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.hostName) {
            andList.push({ hostName: req.body.hostName })
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject })
        }
        if (req.body.attendees) {
            andList.push({ attendees: req.body.attendees })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const meetingList = await Meeting.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const meetingCount = await Meeting.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Meeting', true, 200, { meetingList, meetingCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Meeting', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



////

export let createMeeting = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const data = req.body;
            const userName = req.body.attendees; // Array of selected usernames

            // Fetch the host details
            const staff = await Staff.findOne({ empName: req.body.hostName });
            if (!staff) {
                return res.status(400).json({ success: false, message: 'Please select a valid host name.' });
            }
            const hostEmail = staff.email;

            // Send email to the host
            const hostMailOptions = {
                from: config.SERVER.EMAIL_USER,
                to: hostEmail,
                subject: 'You are assigned as the host for the meeting',
                html: `
                <body style="font-family: 'Poppins', Arial, sans-serif">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                    <tr>
                                        <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                            Meeting Schedule
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                            <p>Hello ${staff.empName},</p>
                                            <p>You have been assigned as the host for the following meeting:</p>
                                            <p style="font-weight: bold;color: #345C72">Meeting Topic: ${data.subject}</p>
                                            <p style="font-weight: bold;color: #345C72">Schedule Date and Time: ${data.date} at ${data.time}</p>
                                            <p style="font-weight: bold;color: #345C72">Participant List: ${userName.join(', ')}</p>
                                            <p>Team,<br>Edufynd Private Limited,<br>Chennai.</p>
                                        </td>
                                    </tr>
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

            transporter.sendMail(hostMailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email to the host:', error);
                    return res.status(500).json({ message: 'Error sending email to the host.' });
                } else {
                    console.log('Email sent to the host:', info.response);
                }
            });

            // Fetch the users based on their type
            let users = [];
            if (data.typeOfUser === 'student') {
                users = await Student.find({ name: { $in: userName } }, { name: 1, email: 1 });
            } else if (data.typeOfUser === 'admin') {
                users = await Admin.find({ name: { $in: userName } }, { name: 1, email: 1 });
            } else if (data.typeOfUser === 'agent') {
                users = await Agent.find({ agentName: { $in: userName } }, { agentName: 1, email: 1 });
            } else if (data.typeOfUser === 'staff') {
                users = await Staff.find({ empName: { $in: userName } }, { empName: 1, email: 1 });
            }

            if (users.length > 0) {
                const userEmails = users.map((user) => user.email);
                const userNames = users.map((user) => user.name || user.empName || user.agentName);

                // Create a new meeting instance with the user data
                const meeting = new Meeting({
                    ...data,
                    userName: userNames,
                    userEmail: userEmails,
                });
                // Save the meeting to the database
                const savedMeeting = await meeting.save();

                // Send email to the attendees
                const emailPromises = userEmails.map((email, index) => {
                    const userMailOptions = {
                        from: config.SERVER.EMAIL_USER,
                        to: email,
                        subject: `Meeting Notification: ${savedMeeting.subject}`,
                        html: `
                        <body style="font-family: 'Poppins', Arial, sans-serif">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding: 20px;">
                                        <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                            <tr>
                                                <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                    ${data.subject}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                    <p>Hello ${userNames[index]},</p>
                                                    <p>You have been invited to the following meeting:</p>
                                                    <p style="font-weight: bold;color: #345C72">Meeting Subject: ${data.subject}</p>
                                                   <p style="font-weight: bold;color: #345C72">Schedule Date and Time: ${data.date} at ${data.time}</p>
                                                    <p style="font-weight: bold;color: #345C72">Hosted by: ${staff.empName}</p>
                                                    <p>Team,<br>Edufynd Private Limited,<br>Chennai.</p>
                                                </td>
                                            </tr>
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

                    return transporter.sendMail(userMailOptions);
                });

                await Promise.all(emailPromises);

                response(req, res, activity, 'Level-1', 'Create-Meeting', true, 200, {}, "Meeting notifications sent successfully.");
            } else {
                response(req, res, activity, 'Level-2', 'Create-Meeting', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
            console.error("Error in createMeeting:", err);
            response(req, res, activity, 'Level-3', 'Create-Meeting', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Meeting', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
    }
};
