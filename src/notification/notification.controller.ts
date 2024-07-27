import { Notification, NotificationDocument } from './notification.model'
import { Student, StudentDocument } from '../model/student.model'
import { Staff, StaffDocument } from '../model/staff.model'
import { Admin, AdminDocument } from '../model/admin.model'
import { Agent, AgentDocument } from '../model/agent.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Notification";



export const getAllNotification = async (req, res) => {
    try {
        const data = await Notification.find()
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


export let createNotification = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const notificationData: NotificationDocument = req.body;
            const selectedUserIds = req.body.selectedUserIds || []; // Array of selected user IDs

            let users = [];

            // Fetch users based on typeOfUser
            if (notificationData.typeOfUser === 'student') {
                users = await Student.find({ _id: { $in: selectedUserIds } });
            } else if (notificationData.typeOfUser === 'admin') {
                users = await Admin.find({ _id: { $in: selectedUserIds } });
            } else if (notificationData.typeOfUser === 'agent') {
                users = await Agent.find({ _id: { $in: selectedUserIds } });
            } else if (notificationData.typeOfUser === 'staff') {
                users = await Staff.find({ _id: { $in: selectedUserIds } });
            }
 
            // Check if any users were found
            if (users.length > 0) {
                // Create an array of promises to handle asynchronous operations
            
                const notificationPromises = users.map((user) => {
                    const userName = user.name || user.empName || user.agentName
                    const notification = new Notification({
                        ...notificationData,
                        userName: [userName],
                        userId: user._id
                    });
                    return notification.save();
                });
    
                // Wait for all notifications to be saved
                await Promise.all(notificationPromises);
    
               response(req, res, activity, 'Level-1', 'Create-Notification', true, 200, {}, "Notifications sent successfully");
            } else {
                response(req, res, activity, 'Level-2', 'Create-Notification', false, 404, {}, "No users found for the specified type.");
            
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Notification', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Notification', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateNotification = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const notificationData: NotificationDocument = req.body;
            let statusData = await Notification.findByIdAndUpdate({_id: req.query._id }, {
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

        const notificationList = await Notification.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const notificationCount = await Notification.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterNotification', true, 200, { notificationList, notificationCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterNotification', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export const sendNotificationsToUsers = async (req, res, next) => {
    try {
        const notificationData: NotificationDocument = req.body;

        let users = [];

        // Fetch users based on typeOfUser
        if (notificationData.typeOfUser === 'student') {
            users = await Student.find();
        } else if (notificationData.typeOfUser === 'admin') {
            users = await Admin.find();
        } else if (notificationData.typeOfUser === 'agent') {
            users = await Agent.find();
        } else if (notificationData.typeOfUser === 'staff') {
            users = await Staff.find();
        }

        // Check if any users were found
        if (users.length > 0) {
            // Create an array of promises to handle asynchronous operations
            const notificationPromises = users.map((user) => {
                const userName = user.name || user.empName || user.agentName
                const notification = new Notification({
                    ...notificationData,
                    userName: [userName],
                });
                return notification.save();
            });

            // Wait for all notifications to be saved
            await Promise.all(notificationPromises);

           response(req, res, activity, 'Level-1', 'Send-Notification', true, 200, {}, "Notifications sent successfully");
        } else {
            response(req, res, activity, 'Level-2', 'Send-Notification', false, 404, {}, "No users found for the specified type.");
        
        }
    } catch (err) {
     
        response(req, res, activity, 'Level-3', 'Send-Notification', false, 500, {}, errorMessage.internalServer, err.message)
    }
};




export const getSingleNotificationforStudent = async (req, res) => {
    try {
        const data = await Notification.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Notification', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Notification', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


