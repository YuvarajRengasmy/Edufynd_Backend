import { GeneralEnquiry, GeneralEnquiryDocument } from '../model/generalEnquiry.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "GeneralEnquiry";



export let getAllGeneralEnquiry = async (req, res, next) => {
    try {
        const data = await GeneralEnquiry.find({ isDeleted: false }).sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-General Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-General Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleGeneralEnquiry = async (req, res, next) => {
    try {
        const forex = await GeneralEnquiry.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-General Enquiry', true, 200, forex, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-General Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

export let getAllLoggedGeneralEnquiry = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "GeneralEnquiry" })
        response(req, res, activity, 'Level-1', 'All-Logged GeneralEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged GeneralEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedGeneralEnquiry = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged GeneralEnquiry', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged GeneralEnquiry', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        return response(req, res, activity, 'Level-2', 'Single-Logged GeneralEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }



export let createGeneralEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const contactDetails: GeneralEnquiryDocument = req.body;
            const createData = new GeneralEnquiry(contactDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-1', 'General Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'General Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'General Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateGeneralEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails: GeneralEnquiryDocument = req.body;
            const updateData = await GeneralEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {

                    name: EnquiryDetails.name,
                    email: EnquiryDetails.email,
                    mobileNumber: EnquiryDetails.mobileNumber,
                    message: EnquiryDetails.message,
                    typeOfUser: EnquiryDetails.typeOfUser,
                    studentId: EnquiryDetails.studentId,
                    country: EnquiryDetails.country,
                    universityName: EnquiryDetails.universityName,
//Newly added
                    source: EnquiryDetails.source,
                    studentName: EnquiryDetails.studentName,
                    gender: EnquiryDetails.gender,
                    dob: EnquiryDetails.dob,
                    passportNo: EnquiryDetails.passportNo,
                    expiryDate:EnquiryDetails.expiryDate,
                    cgpa: EnquiryDetails.cgpa,
                    yearPassed: EnquiryDetails.yearPassed,
                    desiredCountry: EnquiryDetails.desiredCountry,
                    desiredCourse: EnquiryDetails.desiredCourse,
                    doYouNeedSupportForLoan: EnquiryDetails.doYouNeedSupportForLoan,
                    whatsAppNumber: EnquiryDetails.whatsAppNumber,
                    qualification: EnquiryDetails.qualification,
                    assignedTo: EnquiryDetails.assignedTo,
                    agentName: EnquiryDetails.agentName,
                    businessName: EnquiryDetails.businessName,
                    agentPrimaryNumber: EnquiryDetails.agentPrimaryNumber,
                    agentWhatsAppNumber: EnquiryDetails.agentWhatsAppNumber,
                    agentEmail: EnquiryDetails.agentEmail,
                    dial1: EnquiryDetails.dial1,
                    dial2: EnquiryDetails.dial2,
                    dial3: EnquiryDetails.dial3,
                    dial4: EnquiryDetails.dial4,

                    modifiedOn: new Date(),
                    modifiedBy: EnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-1', 'Update-LoanEnquiryDetails', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-LoanEnquiryDetails', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteGeneralEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await GeneralEnquiry.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-General Enquiry Details', true, 200, loan, 'Successfully Remove General Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-General Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredGeneralEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        // andList.push({ status: 1 })
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId });
        }
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId });
        }
        if (req.body.name) {
            andList.push({ name: req.body.name })
        }

        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const generalEnquiryList = await GeneralEnquiry.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page).populate('staffId').populate('adminId').populate('studentId')

        const generalEnquiryCount = await GeneralEnquiry.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter General Enquiry', true, 200, { generalEnquiryList, generalEnquiryCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter General Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let activeGeneralEnquiry= async (req, res, next) => {
    try {
        const generalIds = req.body.generalIds; 
  
        const general = await GeneralEnquiry.updateMany(
            { _id: { $in: generalIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (general.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-GeneralEnquiry ', true, 200, general, 'Successfully Activated GeneralEnquiry .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-GeneralEnquiry ', false, 400, {}, 'Already GeneralEnquiry were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-GeneralEnquiry ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateGeneralEnquiry = async (req, res, next) => {
    try {
        const generalIds = req.body.generalIds;  
      const general = await GeneralEnquiry.updateMany(
        { _id: { $in: generalIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (general.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-GeneralEnquiry', true, 200, general, 'Successfully deactivated GeneralEnquiry.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-GeneralEnquiry', false, 400, {}, 'Already GeneralEnquiry were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-GeneralEnquiry', false, 500, {}, 'Internal Server Error', err.message);
    }
  };


  export let assignStaffId = async (req, res, next) => {
    try {
        const { studentEnquiryIds, staffId,staffName } = req.body;  
        const user = await GeneralEnquiry.updateMany(
            { _id: { $in: studentEnquiryIds } }, 
            { $set: { staffId: staffId , staffName:staffName } }, 
            { new: true }
        );

        if (user.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Assign staff', true, 200, user, 'Successfully assigned staff');
        } else {
            response(req, res, activity, 'Level-3', 'Assign staff', false, 400, {}, 'No staff were assigned.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Assign staff', false, 500, {}, 'Internal Server Error', err.message);
    }
};