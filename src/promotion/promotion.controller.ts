import { Promotion, PromotionDocument } from './promotion.model'
import { Student } from '../model/student.model'
import { Staff } from '../model/staff.model'
import { Admin } from '../model/admin.model'
import { Agent } from '../model/agent.model'
import { validationResult } from "express-validator";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as config from '../config';
import { format } from 'date-fns'; // To format the date


var activity = "Promotion";



export const getAllPromotion = async (req, res) => {
    try {
        const data = await Promotion.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Promotion', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Promotion', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSinglePromotion = async (req, res) => {
    try {
        const data = await Promotion.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Promotion', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Promotion', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createPromotion = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const data: PromotionDocument = req.body
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
                const promotion = new Promotion({
                    ...data,
                    userName: userNames,
                    userEmail: userEmails
                });

                // Save the promotion to the database
                const savedPromotion = await promotion.save();
                // const sanitizedContent = stripHtmlTags(savedPromotion.content);
                const sanitizedContent = savedPromotion.content

                // Prepare email attachments
                const attachments = [];
                let cid = ''
                    if (savedPromotion.uploadImage) {
                        const [fileType, fileContent] = savedPromotion.uploadImage.split("base64,");
                        const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                        const timestamp = format(new Date(), 'yyyyMMdd');
                        const dynamicFilename = `${savedPromotion.subject.replace(/\s+/g, '_')}_${timestamp}.${extension}`;
                        cid = `image_${Date.now()}.${extension}`; // Create a unique CID for the image

                    attachments.push({
                        filename: dynamicFilename,
                        content: savedPromotion.uploadImage.split("base64,")[1],
                        encoding: 'base64',
                        cid: cid

                    });
                }
                // Send emails to all users
                const emailPromises = userEmails.map((email, index) => {
      
                    const mailOptions = {
                        from: config.SERVER.EMAIL_USER,
                        to: email,
                        subject: `${savedPromotion.subject}`,
                        html: `
                                      <body style="font-family: 'Poppins', Arial, sans-serif">
                                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                  <td align="center" style="padding: 20px;">
                                                      <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                          <!-- Header -->
                                                          <tr>
                                                              <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                              ${savedPromotion.subject}
                                                              </td>
                                                          </tr>
                              
                                                          <!-- Body -->
                                                          <tr>
                                                              <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                                  <p>Hello ${userNames[index]},</p>
                                                                  <p>You Have an New Promotion.</p>
                                                                  <p style="font-weight: bold,color: #345C72">Promotion Notification:  ${sanitizedContent}</p>
                                                           
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
                    transporter.sendMail(mailOptions, (error, info) => {

                        if (error) {
                            console.error('Error sending email:', error);
                            return res.status(500).json({ message: 'Error sending email' });
                        } else {
                            console.log('Email sent:', info.response);
                            res.status(201).json({ message: 'You have received a Promotion Notification', student: savedPromotion });
                        }
                    });
                });
                await Promise.all(emailPromises);

                response(req, res, activity, 'Level-1', 'Create-Promotion', true, 200, {}, "Promotion Notifications sent successfully via Email");
            } else {
                response(req, res, activity, 'Level-2', 'Create-Promotion', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
            response(req, res, activity, 'Level-3', 'Create-Promotion', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Promotion', false, 422, {},  errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const updatePromotion = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const promotionData: PromotionDocument = req.body;
            let statusData = await Promotion.findByIdAndUpdate({ _id: promotionData._id }, {
                $set: {
                    typeOfUser: promotionData.typeOfUser,
                    userName: promotionData.userName,
                    subject: promotionData.subject,
                    content: promotionData.content,
                    uploadImage: promotionData.uploadImage,
                    fileUpload: promotionData.fileUpload,
                    modifiedOn: new Date(),
                    modifiedBy: promotionData.modifiedBy,
                },

            }, { new: true });

            response(req, res, activity, 'Level-2', 'Update-Promotion', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Promotion', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Promotion', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deletePromotion = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await Promotion.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Promotion', true, 200, data, 'Successfully Remove Promotion');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Promotion', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredPromotion = async (req, res, next) => {
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

        const promotionList = await Promotion.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const promotionCount = await Promotion.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPromotion', true, 200, { promotionList, promotionCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPromotion', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



