import {StudentEnquiry,StudentEnquiryDocument} from "../model/studentEnquiry.model";
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import * as TokenManager from "../../utils/tokenManager";
import { response, transporter } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import csv = require("csvtojson");

var activity = "StudentEnquiry";

export let getAllStudentEnquiry = async (req, res, next) => {
    try {
        const data = await StudentEnquiry.find({ isDeleted: false }).sort({
            studentCode: -1,
        });
        response(
            req,
            res,
            activity,
            "Level-1",
            "GetAll-StudentEnquiry",
            true,
            200,
            data,
            clientError.success.fetchedSuccessfully
        );
    } catch (err: any) {
        response(
            req,
            res,
            activity,
            "Level-3",
            "GetAll-StudentEnquiry",
            false,
            500,
            {},
            errorMessage.internalServer,
            err.message
        );
    }
};

export let getSingleStudentEnquiry = async (req, res, next) => {
    try {
        const student = await StudentEnquiry.findOne({ _id: req.query._id });
        response(
            req,
            res,
            activity,
            "Level-1",
            "Get-Single-StudentEnquiry",
            true,
            200,
            student,
            clientError.success.fetchedSuccessfully
        );
    } catch (err: any) {
        response(
            req,
            res,
            activity,
            "Level-3",
            "Get-Single-StudentEnquiry",
            false,
            500,
            {},
            errorMessage.internalServer,
            err.message
        );
    }
};

export let getAllLoggedStudentEnquiry = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "StudentEnquiry" })
        response(req, res, activity, 'Level-1', 'All-Logged StudentEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged StudentEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedStudentEnquiry = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged StudentEnquiry', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged StudentEnquiry', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        return response(req, res, activity, 'Level-2', 'Single-Logged StudentEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


const generateNextStudentCode = async (): Promise<string> => {
    const student = await StudentEnquiry.find({}, "studentCode").exec();
    const maxCounter = student.reduce((max, app) => {
        const appCode = app.studentCode;
        const parts = appCode.split("_");
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10);
            return counter > max ? counter : max;
        }
        return max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, "0");
    // Return the new Applicantion Code
    return `SR_${formattedCounter}`;
};

export let createStudentEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const enquiryDetails: StudentEnquiryDocument = req.body;
            enquiryDetails.createdOn = new Date();
            enquiryDetails.studentCode = await generateNextStudentCode();
            const createData = new StudentEnquiry(enquiryDetails);
            let insertData = await createData.save();

            response(req, res,activity,"Level-2","StudentEnquiry-Created",true,200,insertData,clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req,res,activity,"Level-3","StudentEnquiry-Created",false,500,{},errorMessage.internalServer,err.message);
        }
    } else {
        response(req,res,activity,"Level-3","StudentEnquiry-Created",false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped()));
    }
};

export let updateStudentEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const studentEnquiryDetails: StudentEnquiryDocument = req.body;
            const updateData = await StudentEnquiry.findOneAndUpdate(
                { _id: req.body._id },
                {
                    $set: {
                        source: studentEnquiryDetails.source,
                        name: studentEnquiryDetails.name,
                        dob: studentEnquiryDetails.dob,
                        passportNo: studentEnquiryDetails.passportNo,
                        qualification: studentEnquiryDetails.qualification,
                        whatsAppNumber: studentEnquiryDetails.whatsAppNumber,
                        primaryNumber: studentEnquiryDetails.primaryNumber,
                        email: studentEnquiryDetails.email,
                        cgpa: studentEnquiryDetails.cgpa,
                        yearPassed: studentEnquiryDetails.yearPassed,
                        desiredCountry: studentEnquiryDetails.desiredCountry,
                        desiredCourse: studentEnquiryDetails.desiredCourse,
                        doYouNeedSupportForLoan:
                            studentEnquiryDetails.doYouNeedSupportForLoan,
                        assignedTo: studentEnquiryDetails.assignedTo,
                        message: studentEnquiryDetails.message,

                        // New Added Field
                        gender: studentEnquiryDetails.gender,
                        citizenShip: studentEnquiryDetails.citizenShip,
                        expiryDate: studentEnquiryDetails.expiryDate,
                        desiredUniversity: studentEnquiryDetails.desiredUniversity,
                        doYouHoldAnyOtherOffer:
                            studentEnquiryDetails.doYouHoldAnyOtherOffer,
                        country: studentEnquiryDetails.country,
                        universityName: studentEnquiryDetails.universityName,
                        programName: studentEnquiryDetails.programName,
                        refereeName: studentEnquiryDetails.refereeName,
                        refereeContactNo: studentEnquiryDetails.refereeContactNo,
                        registerForIELTSClass: studentEnquiryDetails.registerForIELTSClass,
                        studentId: studentEnquiryDetails.studentId,
                        studentName: studentEnquiryDetails.studentName,
                        agentName: studentEnquiryDetails.agentName,
                        businessName: studentEnquiryDetails.businessName,
                        agentPrimaryNumber: studentEnquiryDetails.agentPrimaryNumber,
                        agentWhatsAppNumber: studentEnquiryDetails.agentWhatsAppNumber,
                        agentEmail: studentEnquiryDetails.agentEmail,
                        dial: studentEnquiryDetails.dial,
                        dial1: studentEnquiryDetails.dial1,
                        dial2: studentEnquiryDetails.dial2,
                        dial3: studentEnquiryDetails.dial3,
                        dial4: studentEnquiryDetails.dial4,

                        modifiedOn: new Date(),
                        modifiedBy: studentEnquiryDetails.modifiedBy,
                    },
                }
            );
            response(
                req,
                res,
                activity,
                "Level-2",
                "Update-studentEnquiryDetails",
                true,
                200,
                updateData,
                clientError.success.updateSuccess
            );
        } catch (err: any) {
            response(
                req,
                res,
                activity,
                "Level-3",
                "Update-studentEnquiryDetails",
                false,
                500,
                {},
                errorMessage.internalServer,
                err.message
            );
        }
    } else {
        response(
            req,
            res,
            activity,
            "Level-3",
            "Update-studentEnquiryDetails",
            false,
            422,
            {},
            errorMessage.fieldValidation,
            JSON.stringify(errors.mapped())
        );
    }
};

export let deleteStudentEnquiry = async (req, res, next) => {
    try {
        let id = req.query._id;
        const student = await StudentEnquiry.findByIdAndDelete({ _id: id });

        response(
            req,
            res,
            activity,
            "Level-2",
            "Delete-student Enquiry Details",
            true,
            200,
            student,
            "Successfully Remove student Enquiry Details"
        );
    } catch (err: any) {
        response(
            req,
            res,
            activity,
            "Level-3",
            "Delete-student Enquiry Details",
            false,
            500,
            {},
            errorMessage.internalServer,
            err.message
        );
    }
};

export let getFilteredStudentEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = [];
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false });
        // andList.push({ status: 1 });
        if (req.body.studentCode) {
            andList.push({ studentCode: req.body.studentCode });
        }
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId });
        }
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId });
        }
        if (req.body.name) {
            andList.push({ name: req.body.name });
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo });
        }
        if (req.body.email) {
            andList.push({ email: req.body.email });
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber });
        }

        findQuery = andList.length > 0 ? { $and: andList } : {};

        const studentList = await StudentEnquiry.find(findQuery)
            .sort({ studentCode: -1 })
            .limit(limit)
            .skip(page).populate('staffId').populate('adminId');

        const studentCount = await StudentEnquiry.find(findQuery).count();
        response(
            req,
            res,
            activity,
            "Level-1",
            "Get-FilterStudentEnquiry",
            true,
            200,
            { studentList, studentCount },
            clientError.success.fetchedSuccessfully
        );
    } catch (err: any) {
        response(
            req,
            res,
            activity,
            "Level-3",
            "Get-FilterStudentEnquiry",
            false,
            500,
            {},
            errorMessage.internalServer,
            err.message
        );
    }
};



export let activeStudentEnquiry = async (req, res, next) => {
    try {
        const studentEnquiryIds = req.body.studentEnquiryIds; 
  
        const student = await StudentEnquiry.updateMany(
            { _id: { $in: studentEnquiryIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (student.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-StudentEnquiry ', true, 200, student, 'Successfully Activated StudentEnquiry .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-StudentEnquiry ', false, 400, {}, 'Already StudentEnquiry were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-StudentEnquiry ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateStudentEnquiry = async (req, res, next) => {
    try {
        const studentEnquiryIds = req.body.studentEnquiryIds;   
      const student = await StudentEnquiry.updateMany(
        { _id: { $in: studentEnquiryIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (student.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-StudentEnquiry', true, 200, student, 'Successfully deactivated StudentEnquiry.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-StudentEnquiry', false, 400, {}, 'Already StudentEnquiry were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-StudentEnquiry', false, 500, {}, 'Internal Server Error', err.message);
    }
  };


  export let assignStaffId = async (req, res, next) => {
    try {
        const { studentEnquiryIds, staffId,staffName } = req.body;  // Destructure studentEnquiryIds and staffId from the request body

        // Update all student enquiries with the selected staffId
        const student = await StudentEnquiry.updateMany(
            { _id: { $in: studentEnquiryIds } },  // Find student enquiries by IDs
            { $set: { staffId: staffId , staffName:staffName } },       // Set the staffId field
            { new: true }
        );

        if (student.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Assign staff', true, 200, student, 'Successfully assigned staff');
        } else {
            response(req, res, activity, 'Level-3', 'Assign staff', false, 400, {}, 'No staff were assigned.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Assign staff', false, 500, {}, 'Internal Server Error', err.message);
    }
};

