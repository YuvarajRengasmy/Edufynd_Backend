import { Promotion, PromotionDocument } from './promotion.model'
import { Student} from '../model/student.model'
import { Staff} from '../model/staff.model'
import { Admin} from '../model/admin.model'
import { Agent} from '../model/agent.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Promotion";



export const getAllPromotion = async (req, res) => {
    try {
        const data = await Promotion.find()
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
            const data: PromotionDocument = req.body;
            const userName = req.body.userName; // Array of selected usernames
            // const userIds = req.body._id; // Array of selected user IDs (assuming this is passed in the request body)

            let users = [];

            // Fetch users based on typeOfUser
            if (data.typeOfUser === 'student') {
                users = await Student.find({ name: { $in: userName } });
            } else if (data.typeOfUser === 'admin') {
                users = await Admin.find({ name: { $in: userName } });
            } else if (data.typeOfUser === 'agent') {
                users = await Agent.find({ agentName: { $in: userName } });
            } else if (data.typeOfUser === 'staff') {
                users = await Staff.find({ empName: { $in: userName } });
            }

            // Check if any users were found
            if (users.length > 0) {
                // Collect usernames for the notification
                const userNames = users.map((user) => user.name || user.empName || user.agentName);

                // Create a single notification document with all selected usernames
                const notification = new Promotion({
                    ...data,
                    userName: userNames,
                });

                // Save the notification to the database
                const savedNotification = await notification.save();

                // Add the notification ID to each selected user's notifications array
                const updatePromises = users.map((user) => {
                    user.notificationId.push(savedNotification._id);
                    return user.save();
                });

                // Wait for all user updates to be saved
                await Promise.all(updatePromises);

                response(req, res, activity, 'Level-1', 'Create-Promotion', true, 200, {}, " Promotion Notifications sent successfully");
            } else {
                response(req, res,  activity, 'Level-2', 'Create-Promotion', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
         
            response(req, res,  activity, 'Level-3', 'Create-Promotion', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res,  activity, 'Level-3', 'Create-Promotion', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
    }
};


export const updatePromotion = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const promotionData: PromotionDocument = req.body;
            let statusData = await Promotion.findByIdAndUpdate({_id: req.query._id }, {
                $set: {
                    typeOfUser: promotionData.typeOfUser,
                    userName:promotionData.userName,
                    subject: promotionData.subject,
                    content: promotionData.content,
                    uploadImage: promotionData.uploadImage,
                 
                    modifiedOn: new Date(),
                    modifiedBy:  promotionData.modifiedBy,
                },
              
            },{ new: true });

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



export let getFilteredPromotion   = async (req, res, next) => {
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

        const promotionList = await Promotion.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const promotionCount = await Promotion.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPromotion', true, 200, { promotionList, promotionCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPromotion', false, 500, {}, errorMessage.internalServer, err.message);
    }
};