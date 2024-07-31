import { Testimonial, TestimonialDocument } from './testimonial.model'
import { Student} from '../model/student.model'
import { Staff} from '../model/staff.model'
import { Admin} from '../model/admin.model'
import { Agent} from '../model/agent.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Testimonial";



export const getAllTestimonial = async (req, res) => {
    try {
        const data = await Testimonial.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Testimonial', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Testimonial', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleTestimonial = async (req, res) => {
    try {
        const data = await Testimonial.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Testimonial', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Testimonial', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



export let createTestimonial = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const data: TestimonialDocument = req.body;
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
                const notification = new Testimonial({
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

                response(req, res, activity, 'Level-1', 'Create-Testimonial', true, 200, {}, " Testimonial Notifications sent successfully");
            } else {
                response(req, res,  activity, 'Level-2', 'Create-Testimonial', false, 404, {}, "No users found for the specified type.");
            }
        } catch (err) {
         
            response(req, res,  activity, 'Level-3', 'Create-Testimonial', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        response(req, res,  activity, 'Level-3', 'Create-Testimonial', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
    }
};


export const updateTestimonial = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const testimonialData:TestimonialDocument = req.body;
            let statusData = await Testimonial.findByIdAndUpdate({_id:testimonialData._id }, {
                $set: {
                    typeOfUser: testimonialData.typeOfUser,
                    userName:testimonialData.userName,
                    courseOrUniversityName:testimonialData.courseOrUniversityName,
                    location: testimonialData.location,
                    content: testimonialData.content,
                    uploadImage: testimonialData.uploadImage,
                    counselorName: testimonialData.counselorName,
                 
                    modifiedOn: new Date(),
                    modifiedBy:  testimonialData.modifiedBy,
                },
              
            },{ new: true });

            response(req, res, activity, 'Level-2', 'Update-Testimonial', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Testimonial', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Testimonial', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let deleteTestimonial = async (req, res, next) => {
  
    try {
        let id = req.query._id;
        const data = await Testimonial.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Testimonial', true, 200, data, 'Successfully Remove Testimonial');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Testimonial', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let getFilteredTestimonial   = async (req, res, next) => {
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
        if (req.body.name) {
            andList.push({ name: req.body.name })
        }
        if (req.body.courseOrUniversityName) {
            andList.push({ courseOrUniversityName: req.body.courseOrUniversityName })
        }
        if (req.body.content) {
            andList.push({ content: req.body.content })
        }
        if (req.body.location) {
            andList.push({ location: req.body.location })
        }   
        if (req.body.counselorName) {
            andList.push({ counselorName: req.body.counselorName })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const testimonialList = await Testimonial.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const testimonialCount = await Testimonial.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter-Testimonial', true, 200, { testimonialList, testimonialCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter-Testimonial', false, 500, {}, errorMessage.internalServer, err.message);
    }
};