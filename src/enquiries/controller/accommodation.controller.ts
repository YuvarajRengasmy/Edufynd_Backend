import { Accommodation, AccommodationDocument } from '../model/accommodation.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { response} from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Accommodation_Enquiry";



export let getAllAccommodation = async (req, res, next) => {
    try {
        const data = await Accommodation.find({ isDeleted: false }).sort({ accommodationID: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-AccommodationEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-AccommodationEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleAccommodation = async (req, res, next) => {
    try {
        const accommodation = await Accommodation.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-AccommodationEnquiry', true, 200, accommodation, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Single-AccommodationEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

export let getAllLoggedAccommodation = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Accommodation" })
        response(req, res, activity, 'Level-1', 'All-Logged Accommodation', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Accommodation', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


 

  export let getSingleLoggedAccommodation = async (req, res) => {
    try {
      const { _id } = req.query;
  
      // Fetch logs that match the documentId
      const logs = await Logs.find({ documentId: _id });
  
      // If no logs are found, return a 404 response and stop further execution
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged Accommodation', false, 404, {}, "No logs found.");
      }
  
      // If logs are found, return a 200 response with logs data
      return response(req, res, activity, 'Level-1', 'Single-Logged Accommodation', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      // Handle errors and return a 500 response, then stop execution
      return response(req, res, activity, 'Level-2', 'Single-Logged Accommodation', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };
  
const generateNextAccommodationID = async (): Promise<string> => {
    const enquiry = await Accommodation.find({}, 'accommodationID').exec();
    const maxCounter = enquiry.reduce((max, app) => {
        const appCode = app.accommodationID;
        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `EA_${formattedCounter}`;
};



export let createAccommodation = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const accommodationDetails: AccommodationDocument = req.body;
            accommodationDetails.createdOn = new Date();
            accommodationDetails.accommodationID = await generateNextAccommodationID()
            const createData = new Accommodation(accommodationDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-1', 'Accommodation Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Accommodation Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Accommodation Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateAccommodation = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const accommodationDetails: AccommodationDocument = req.body;
            const updateData = await Accommodation.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    studentName: accommodationDetails.studentName,
                    source: accommodationDetails.source,
                    passportNumber: accommodationDetails.passportNumber,
                    expiryDate:accommodationDetails.expiryDate,
                    courseType: accommodationDetails.courseType,
                    whatsAppNumber:accommodationDetails.whatsAppNumber,
                    universityName: accommodationDetails.universityName,
                    final:accommodationDetails.final,
                    accommodationType: accommodationDetails.accommodationType,
                    agentName:accommodationDetails.agentName,
                    businessName:accommodationDetails.businessName,
                    agentWhatsAppNumber: accommodationDetails.agentWhatsAppNumber,
                    assignedTo: accommodationDetails.assignedTo,
                    message: accommodationDetails.message,
                    studentId: accommodationDetails.studentId,
                    country: accommodationDetails.country,
                    state:accommodationDetails.state,
                    lga: accommodationDetails.lga,
                    dial1: accommodationDetails.dial1,
                    dial2: accommodationDetails.dial2,
                    dial3: accommodationDetails.dial3,
                    dial4: accommodationDetails.dial4,
                    name:accommodationDetails.name,
                
                    modifiedOn: new Date(),
                    modifiedBy: accommodationDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-1', 'Update-Accommodation Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Accommodation Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Accommodation Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deleteAccommodationEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await Accommodation.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-1', 'Delete-Accommodation Enquiry Details', true, 200, loan, 'Successfully Remove Accommodation Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-2', 'Delete-Accommodation Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredAccommodation = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        // andList.push({ status: 1 })
        if (req.body.agentId) {
            andList.push({ agentId: req.body.agentId })
        }
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId })
        }

        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.UniversityName) {
            andList.push({ UniversityName: req.body.UniversityName })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const accommodationList = await Accommodation.find(findQuery).sort({ accommodationID: -1 }).limit(limit).skip(page).populate("adminId").populate("staffId")
        const accommodationCount = await Accommodation.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Accommodation Enquiry', true, 200, { accommodationList, accommodationCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'Get-Filter Accommodation Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let activeAccommodation = async (req, res, next) => {
    try {
        const accommodationIds = req.body.accommodationIds; 
  
        const accommodation = await Accommodation.updateMany(
            { _id: { $in: accommodationIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (accommodation.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-Accommodation ', true, 200, accommodation, 'Successfully Activated Accommodation .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-Accommodation ', false, 400, {}, 'Already Accommodation were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-Accommodation ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateAccommodation = async (req, res, next) => {
    try {
        const accommodationIds = req.body.accommodationIds     
      const accommodation = await Accommodation.updateMany(
        { _id: { $in: accommodationIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (accommodation.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-Accommodation', true, 200, accommodation, 'Successfully deactivated Accommodation.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-Accommodation', false, 400, {}, 'Already Accommodation were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-Accommodation', false, 500, {}, 'Internal Server Error', err.message);
    }
  };



  export let assignStaffId = async (req, res, next) => {
    try {
        const { studentEnquiryIds, staffId,staffName } = req.body;  


        const user = await Accommodation.updateMany(
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