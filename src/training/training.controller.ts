import { Training, TrainingDocument } from './training.model'
import { Student} from '../model/student.model'
import { Staff} from '../model/staff.model'
import { Admin} from '../model/admin.model'
import { Agent} from '../model/agent.model'
import { Logs } from "../model/logs.model";
import { validationResult } from "express-validator";
import { response, transporter} from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import * as config from '../config';
import { format } from 'date-fns'; // To format the date


var activity = "Training";



export const getAllTraining = async (req, res) => {
    try {
        const data = await Training.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Training', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        
        response(req, res, activity, 'Level-1', 'GetAll-Training', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleTraining = async (req, res) => {
    try {
        const data = await Training.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Training', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Training', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



export let getAllLoggedTraining = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Training" })
        response(req, res, activity, 'Level-1', 'All-Logged Training', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Training', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getSingleLoggedTraining = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged Training', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged Training', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        console.log(err)
        return response(req, res, activity, 'Level-2', 'Single-Logged Training', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }



const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};


export let createTraining = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const data: TrainingDocument = req.body;
            const usersName = req.body.usersName;// Array of selected usernames

            let users = [];

            // Fetch users based on typeOfUser
            if (data.typeOfUser === 'student') {
                users = await Student.find({ name: { $in: usersName } }, { name: 1, email: 1 });
            } else if (data.typeOfUser === 'admin') {
                users = await Admin.find({ name: { $in: usersName } }, { name: 1, email: 1 });
            } else if (data.typeOfUser === 'agent') {
                users = await Agent.find({ agentName: { $in: usersName } }, { agentName: 1, email: 1 });
            } else if (data.typeOfUser === 'staff') {
                users = await Staff.find({ empName: { $in: usersName } }, { empName: 1, email: 1 });
            }

            // Check if any users were found
            if (users.length > 0) {
                // Collect usernames and emails for the notification
                const userNames = users.map((user) => user.name || user.empName || user.agentName);
                const userEmails = users.map((user) => user.email);

                // Create a single notification document with all selected usernames and emails
                const training = new Training({
                    ...data,
                    usersName: userNames,
                    userEmail: userEmails
                });

                // Save the promotion to the database
                const savedTraining = await training.save();
                const sanitizedContent = stripHtmlTags(savedTraining.content);

                // Prepare email attachments
                const attachments = [];
                let cid = ''
                    if (savedTraining.uploadDocument) {
                        const [fileType, fileContent] = savedTraining.uploadDocument.split("base64,");
                        const extension = fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                        const timestamp = format(new Date(), 'yyyyMMdd');
                        const dynamicFilename = `${savedTraining.subject.replace(/\s+/g, '_')}_${timestamp}.${extension}`;
                        cid = `image_${Date.now()}.${extension}`; // Create a unique CID for the image

                    attachments.push({
                        filename: dynamicFilename,
                        content: savedTraining.uploadDocument.split("base64,")[1],
                        encoding: 'base64',
                        cid: cid

                    });
                }
                // Send emails to all users
                const emailPromises = userEmails.map((email, index) => {
      
                    const mailOptions = {
                        from: config.SERVER.EMAIL_USER,
                        to: email,
                        subject: `${savedTraining.subject}`,
                        html: `
                                      <body style="font-family: 'Poppins', Arial, sans-serif">
                                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                  <td align="center" style="padding: 20px;">
                                                      <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                          <!-- Header -->
                                                          <tr>
                                                              <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                              ${savedTraining.subject}
                                                              </td>
                                                          </tr>
                              
                                                          <!-- Body -->
                                                          <tr>
                                                              <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                                  <p>Hello ${usersName[index]},</p>
                                                                  <p>Training Schedule.</p>
                                                                  <p style="font-weight: bold,color: #345C72">Training Topic:  ${savedTraining.trainingTopic}</p>
                                                                   <p style="font-weight: bold,color: #345C72">Trainer Name:  ${savedTraining.name}</p>
                                                                   <p style="font-weight: bold,color: #345C72">Content:  ${savedTraining.content}</p>
                                                                    <p style="font-weight: bold,color: #345C72">Material Details:  ${savedTraining.material}</p>
                                                                     <p style="font-weight: bold,color: #345C72">Training Date:  ${savedTraining.date}</p>
                                                                      <p style="font-weight: bold,color: #345C72">Training Time:  ${savedTraining.time}</p>
                                                           
                                                                ${cid ? `<img src="cid:${cid}" alt="image" width="500" height="300" />` : ''}
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
  
                    // return transporter.sendMail(mailOptions);
                    transporter.sendMail(mailOptions, (error, info) => {

                        if (error) {
                            console.error('Error sending email:', error);
                            return res.status(500).json({ message: 'Error sending email' });
                        } else {
                            console.log('Email sent:', info.response);
                            res.status(201).json({ message: 'You have received a Training Session Notification'});
                        }
                    });
                });

                // Wait for all emails to be sent
                await Promise.all(emailPromises);

                response(req, res, activity, 'Level-1', 'Create-Training', true, 200, {}, "Training Notifications sent successfully by Email");
            } else {
                response(req, res, activity, 'Level-2', 'Create-Training', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
            response(req, res, activity, 'Level-3', 'Create-Training', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Training', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
    }
};
export const updateTraining = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const trainingData: TrainingDocument = req.body;
            let statusData = await Training.findByIdAndUpdate({_id: trainingData._id }, {
                $set: {
                    requestTraining: trainingData.requestTraining,
                    trainingTopic: trainingData.trainingTopic,
                    date:trainingData.date,
                    fileUpload: trainingData.fileUpload,
                    time:trainingData.time,
                    typeOfUser: trainingData.typeOfUser,
                    usersName:trainingData.usersName,
                    material: trainingData.material,
                    name: trainingData.name,
                    subject: trainingData.subject,
                    content: trainingData.content,
                    hostName:trainingData.hostName,
                 
                    modifiedOn: new Date(),
                    modifiedBy:  trainingData.modifiedBy,
                },
              
            },{ new: true });

            response(req, res, activity, 'Level-2', 'Update-Training', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Training', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Training', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteTraining = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const data = await Training.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Training', true, 200, data, 'Successfully Remove Training');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Training', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredTraining   = async (req, res, next) => {
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

        const trainingList = await Training.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const trainingCount = await Training.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterTraining', true, 200, { trainingList, trainingCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterTraining', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let activeTraining = async (req, res, next) => {
    try {
        const trainingIds = req.body.trainingIds; 
        const training = await Training.updateMany(
            { _id: { $in: trainingIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (training.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-Training ', true, 200, training, 'Successfully Activated Training .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-Training ', false, 400, {}, 'Already Training were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-Training ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateTraining = async (req, res, next) => {
    try {
        const trainingIds = req.body.trainingIds;  
        const training = await Training.updateMany(
        { _id: { $in: trainingIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (training.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-Training', true, 200, training, 'Successfully deactivated Training.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-Training', false, 400, {}, 'Already Training were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-Training', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
