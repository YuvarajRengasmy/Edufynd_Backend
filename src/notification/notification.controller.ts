import { Notification, NotificationDocument } from './notification.model'
import { Student, StudentDocument } from '../model/student.model'
import { Staff, StaffDocument } from '../model/staff.model'
import { Admin, AdminDocument } from '../model/admin.model'
import { Agent, AgentDocument } from '../model/agent.model'
import { validationResult } from "express-validator";
import { response, transporter} from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { format } from 'date-fns'; 
import * as config from '../config';


var activity = "Notification";



export const getAllNotification = async (req, res) => {
    try {
        const data = await Notification.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Notification', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Notification', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleNotification = async (req, res) => {
    try {
        const data = await Notification.findOne({ _id: req.query._id })
        console.log("hh",data)
        response(req, res, activity, 'Level-1', 'GetSingle-Notification', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Notification', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



// export let createNotification = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const notificationData: NotificationDocument = req.body;
//             const userName = req.body.userName; // Array of selected usernames
//             // const userIds = req.body._id; // Array of selected user IDs (assuming this is passed in the request body)

//             let users = [];

//             // Fetch users based on typeOfUser
//             if (notificationData.typeOfUser === 'student') {
//                 users = await Student.find({ name: { $in: userName } });
//             } else if (notificationData.typeOfUser === 'admin') {
//                 users = await Admin.find({ name: { $in: userName } });
//             } else if (notificationData.typeOfUser === 'agent') {
//                 users = await Agent.find({ agentName: { $in: userName } });
//             } else if (notificationData.typeOfUser === 'staff') {
//                 users = await Staff.find({ empName: { $in: userName } });
//             }

//             // Check if any users were found
//             if (users.length > 0) {
//                 // Collect usernames for the notification
//                 const userNames = users.map((user) => user.name || user.empName || user.agentName);

//                 // Create a single notification document with all selected usernames
//                 const notification = new Notification({
//                     ...notificationData,
//                     userName: userNames,
//                 });

//                 // Save the notification to the database
//                 const savedNotification = await notification.save();

//                 // Add the notification ID to each selected user's notifications array
//                 const updatePromises = users.map((user) => {
//                     user.notificationId.push(savedNotification._id);
//                     return user.save();
//                 });

//                 // Wait for all user updates to be saved
//                 await Promise.all(updatePromises);

//                 response(req, res,  activity, 'Level-1', 'Create-Notification', true, 200, {}, "Notifications sent successfully");
//             } else {
//                 response(req, res,  activity, 'Level-2', 'Create-Notification', false, 404, {}, "No users found for the specified type.");
//             }
//         } catch (err) {
         
//             response(req, res,  activity, 'Level-3', 'Create-Notification', false, 500, {}, "Internal server error", err.message);
//         }
//     } else {
//         response(req, res,  activity, 'Level-3', 'Create-Notification', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
//     }
// };



const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};


export let createNotification = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const data: NotificationDocument = req.body;
            const userName = req.body.userName; // Array of selected usernames

            let users = [];

            // Fetch users based on typeOfUser
            if (data.typeOfUser === 'student') {
                users = await Student.find({ name: { $in: userName } }, { name: 1, email: 1 });
            } else if (data.typeOfUser === 'admin') {
                users = await Admin.find({ name: { $in: userName } }, { name: 1, email: 1 });
            } else if (data.typeOfUser === 'agent') {
                users = await Agent.find({ agentName: { $in: userName } }, { agentName: 1, email: 1 });
            } else if (data.typeOfUser === 'staff') {
                users = await Staff.find({ empName: { $in: userName } }, { empName: 1, email: 1 });
            }

            // Check if any users were found
            if (users.length > 0) {
                // Collect usernames and emails for the notification
                const userNames = users.map((user) => user.name || user.empName || user.agentName);
                const userEmails = users.map((user) => user.email);

                // Create a single notification document with all selected usernames and emails
                const notification = new Notification({
                    ...data,
                    userName: userNames,
                    userEmail: userEmails
                });

                // Save the promotion to the database
                const savedNotification = await notification.save();
                const sanitizedContent = stripHtmlTags(savedNotification.content);

                // Prepare email attachments
                const attachments = [];
                let cid = ''
                if (savedNotification.uploadImage) {
                    const [fileType, fileContent] = savedNotification.uploadImage.split("base64,");
                    const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                    const timestamp = format(new Date(), 'yyyyMMdd');
                    const dynamicFilename = `${savedNotification.subject.replace(/\s+/g, '_')}_${timestamp}.${extension}`;
                    cid = `image_${Date.now()}.${extension}`; // Create a unique CID for the image

                    attachments.push({
                        filename: dynamicFilename,
                        content: savedNotification.uploadImage.split("base64,")[1],
                        encoding: 'base64',
                        cid: cid
                    });
                }
                // Send emails to all users
                const emailPromises = userEmails.map((email, index) => {
                    // const mailOptions = {
                    //     from: config.SERVER.EMAIL_USER,
                    //     to: email,
                    //     subject:  `${savedNotification.subject}`,
                    //     text: `Hello ${userNames[index]},\n\n${sanitizedContent}\n\nBest regards,\nAfynd Private Limited\nChennai.`,
                    //     attachments: attachments.length > 0 ? attachments : []
                    // };

                    const mailOptions = {
                        from: config.SERVER.EMAIL_USER,
                        to: email,
                        subject: `${savedNotification.subject}`,
                        html: `
                                      <body style="font-family: 'Poppins', Arial, sans-serif">
                                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                  <td align="center" style="padding: 20px;">
                                                      <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                          <!-- Header -->
                                                          <tr>
                                                              <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                              ${savedNotification.subject}
                                                              </td>
                                                          </tr>
                              
                                                          <!-- Body -->
                                                          <tr>
                                                              <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                                  <p>Hello ${userNames[index]},</p>
                                                                  <p>You Have an New Notification</p>
                                                                  <p style="font-weight: bold,color: #345C72">Notification:  ${sanitizedContent}</p>
                                                           
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
                              
                                
                      };

                    // return transporter.sendMail(mailOptions);
                    transporter.sendMail(mailOptions, (error, info) => {

                        if (error) {
                            console.error('Error sending email:', error);
                            return res.status(500).json({ message: 'Error sending email' });
                        } else {
                            console.log('Email sent:', info.response);
                            res.status(201).json({ message: 'You have received a Notification', Details: savedNotification });
                        }
                    });
                });

                // Wait for all emails to be sent
                await Promise.all(emailPromises);

                response(req, res, activity, 'Level-1', 'Create-Notifications', true, 200, {}, "Notifications sent successfully via Email");
            } else {
                response(req, res, activity, 'Level-2', 'Create-Notifications', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
            response(req, res, activity, 'Level-3', 'Create-Notifications', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Notifications', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
    }
};





export const updateNotification = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const notificationData: NotificationDocument = req.body;
            let statusData = await Notification.findByIdAndUpdate({_id: notificationData._id }, {
                $set: {
                    typeOfUser: notificationData.typeOfUser,
                    userName:notificationData.userName,
                    subject: notificationData.subject,
                    content: notificationData.content,
                    uploadImage: notificationData.uploadImage,
                 
                    modifiedOn: new Date(),
                    modifiedBy:  notificationData.modifiedBy,
                },
              
            },{ new: true });

            response(req, res, activity, 'Level-2', 'Update-Notification', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Notification', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Notification', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteNotification = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const data = await Notification.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Notification', true, 200, data, 'Successfully Remove Notification');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Notification', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredNotification   = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.typeOfUser) {
            andList.push({ typeOfUser: req.body.typeOfUser })
        }
        if (req.body.subject) {
            andList.push({ subject: req.body.subject })
        }
        if (req.body.userName) {
            andList.push({ userName: req.body.userName })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const notificationList = await Notification.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const notificationCount = await Notification.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterNotification', true, 200, { notificationList, notificationCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterNotification', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


