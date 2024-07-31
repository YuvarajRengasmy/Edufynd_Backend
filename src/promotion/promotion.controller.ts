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


const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};


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
                const sanitizedContent = stripHtmlTags(savedPromotion.content);

                // Prepare email attachments
                const attachments = [];
                if (savedPromotion.uploadImage) {
                    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
                    const dynamicFilename = `${savedPromotion.subject.replace(/\s+/g, '_')}_${timestamp}.jpg`;

                    attachments.push({
                        filename: dynamicFilename,
                        content: savedPromotion.uploadImage.split("base64,")[1],
                        encoding: 'base64'
                    });
                }
                // Send emails to all users
                const emailPromises = userEmails.map((email, index) => {
                    const mailOptions = {
                        from: config.SERVER.EMAIL_USER,
                        to: email,
                        subject:  `${savedPromotion.subject}`,
                        text: `Hello ${userNames[index]},\n\n${sanitizedContent}\n\nBest regards,\nAfynd Private Limited\nChennai.`,
                        attachments: attachments.length > 0 ? attachments : []
                    };

                    // return transporter.sendMail(mailOptions);
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

                // Wait for all emails to be sent
                await Promise.all(emailPromises);

                response(req, res, activity, 'Level-1', 'Create-Promotion', true, 200, {}, "Promotion Notifications sent successfully via Email");
            } else {
                response(req, res, activity, 'Level-2', 'Create-Promotion', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
            response(req, res, activity, 'Level-3', 'Create-Promotion', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Promotion', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
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






// export let createPromotion = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const data: PromotionDocument = req.body;
//             const userName = req.body.userName; // Array of selected usernames
//             // const userIds = req.body._id; // Array of selected user IDs (assuming this is passed in the request body)

//             let users = [];

//             // Fetch users based on typeOfUser
//             if (data.typeOfUser === 'student') {
//                 users = await Student.find({ name: { $in: userName } });
//             } else if (data.typeOfUser === 'admin') {
//                 users = await Admin.find({ name: { $in: userName } });
//             } else if (data.typeOfUser === 'agent') {
//                 users = await Agent.find({ agentName: { $in: userName } });
//             } else if (data.typeOfUser === 'staff') {
//                 users = await Staff.find({ empName: { $in: userName } });
//             }

//             // Check if any users were found
//             if (users.length > 0) {
//                 // Collect usernames for the notification
//                 const userNames = users.map((user) => user.name || user.empName || user.agentName);

//                 // Create a single notification document with all selected usernames
//                 const notification = new Promotion({
//                     ...data,
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

//                 response(req, res, activity, 'Level-1', 'Create-Promotion', true, 200, {}, " Promotion Notifications sent successfully");
//             } else {
//                 response(req, res,  activity, 'Level-2', 'Create-Promotion', false, 404, {}, "No users found for the specified type.");
//             }
//         } catch (err) {

//             response(req, res,  activity, 'Level-3', 'Create-Promotion', false, 500, {}, "Internal server error", err.message);
//         }
//     } else {
//         response(req, res,  activity, 'Level-3', 'Create-Promotion', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
//     }
// };
