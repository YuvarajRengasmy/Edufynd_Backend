import { BusinessEnquiry,BusinessEnquiryDocument} from '../model/businessEnquiry.model'
import { EnquiryStatus} from '../../setting/moduleSetting/model/businessEnquiryStatus.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { response, transporter } from "../../helper/commonResponseHandler";
import { format } from 'date-fns';
import * as config from '../../config';


var activity = "BusinessEnquiry";



export let getAllBusinessEnquiry = async (req, res, next) => {
    try {
        const data = await BusinessEnquiry.find({ isDeleted: false }).sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Business Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Business Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleBusinessEnquiry = async (req, res, next) => {
    try {
        const data = await BusinessEnquiry.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Business Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Business Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}

export let getAllLoggedBusinessEnquiry = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "BusinessEnquiry" })
        response(req, res, activity, 'Level-1', 'All-Logged BusinessEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged BusinessEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedBusinessEnquiry = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged BusinessEnquiry', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged BusinessEnquiry', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        return response(req, res, activity, 'Level-2', 'Single-Logged BusinessEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


export let createBusinessEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
                const contactDetails: BusinessEnquiryDocument = req.body;

                // Fetch position and duration details from the ApplicationStatusDocument collection
            const nextDocument = await EnquiryStatus.find({});

            // Initialize estimateDate for each status
            let previousEstimateDate = new Date(); // Start with the current date for the first status

            if (contactDetails.status && contactDetails.status.length > 0) {
                contactDetails.status = contactDetails.status.map((status, index) => {

                    // Fetch the corresponding status details from ApplicationStatusDocument collection
                    const statusDetails = nextDocument.find((appStatus) => appStatus.position === status.position);

                    if (!statusDetails) {
                        throw new Error(`Status with position ${status.position} not found in the ApplicationStatus collection.`);
                    }

                    // For the first status (position 1), set the current date for both createdOn and estimateDate
                    if (statusDetails.position === 1) {
                        // For the first status (position 1), set estimateDate and createdOn to the current date
                        status.estimateDate = new Date(); // Set estimateDate to current date
                        status.createdOn = new Date(); // Set createdOn to current date
                        previousEstimateDate = status.estimateDate; // Set previousEstimateDate for the next position
                    } else {
                        const previousStatus = contactDetails.status.find(
                            (prevStatus) => prevStatus.position === (Number(statusDetails.position) - 1)
                        );
            
                        if (previousStatus) {
                          
                            const previousDurationInDays = Number(previousStatus.duration) || 0;
                            const previousEstimate = new Date(previousStatus.estimateDate);
                            status.estimateDate = new Date(previousEstimate.setDate(previousEstimate.getDate() + previousDurationInDays));
                        } 
                    }
                    // Set other fields like position and duration
                    status.position = statusDetails.position;
                    status.duration = statusDetails.duration;
                    
                    return status
                });
            }

                const createData = new BusinessEnquiry(contactDetails);
                let insertData = await createData.save();
             
                response(req, res, activity, 'Level-2', 'Business Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Business Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Business Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateBusinessEnquiryy = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails: BusinessEnquiryDocument = req.body;
            const updateData = await BusinessEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                 
                    name: EnquiryDetails.name,
                    email: EnquiryDetails.email,
                    mobileNumber:  EnquiryDetails.mobileNumber,
                    message:  EnquiryDetails.message,
                    studentId: EnquiryDetails.studentId,
                    country: EnquiryDetails.country,
                    universityName: EnquiryDetails.universityName,
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
                    dial1: EnquiryDetails.dial1,
                    dial2:EnquiryDetails.dial2,
                 
                    modifiedOn: new Date(),
                    modifiedBy: EnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Business Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Business Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Business Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteBusinessEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const data = await BusinessEnquiry.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Business Enquiry Details', true, 200, data, 'Successfully Remove Business Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Business Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getFilteredBusinessEnquiry = async (req, res, next) => {
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

        const businessEnquiryList = await BusinessEnquiry.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page).populate({ path: 'adminId', select: 'name' }).populate({ path: 'staffId', select: 'name' })

        const businessEnquiryCount = await BusinessEnquiry.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Business Enquiry', true, 200, { businessEnquiryList, businessEnquiryCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Business Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let activeBusinessEnquiry = async (req, res, next) => {
    try {
        const businessEnquiryIds = req.body.businessEnquiryIds; 
  
        const businessEnquiry = await BusinessEnquiry.updateMany(
            { _id: { $in: businessEnquiryIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (businessEnquiry.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-BusinessEnquiry ', true, 200, businessEnquiry, 'Successfully Activated BusinessEnquiry .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-BusinessEnquiry ', false, 400, {}, 'Already BusinessEnquiry were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-BusinessEnquiry ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateBusinessEnquiry = async (req, res, next) => {
    try {
        const businessEnquiryIds = req.body.businessEnquiryIds;     
      const businessEnquiry = await BusinessEnquiry.updateMany(
        { _id: { $in: businessEnquiryIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (businessEnquiry.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-BusinessEnquiry', true, 200, businessEnquiry, 'Successfully deactivated BusinessEnquiry.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-BusinessEnquiry', false, 400, {}, 'Already BusinessEnquiry were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-BusinessEnquiry', false, 500, {}, 'Internal Server Error', err.message);
    }
  };


  export let assignStaffId = async (req, res, next) => {
    try {
        const { studentEnquiryIds, staffId,staffName } = req.body;  


        const user = await BusinessEnquiry.updateMany(
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




const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};

export let updateBusinessEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails: BusinessEnquiryDocument = req.body;
            const application = await BusinessEnquiry.findOne({ $and: [{ _id: { $ne: EnquiryDetails._id } }, { email: EnquiryDetails.email }] });

            if (!application) {
                const updateMaster = new BusinessEnquiry(EnquiryDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
                        $set: {
                            name: EnquiryDetails.name,
                            email: EnquiryDetails.email,
                            mobileNumber:  EnquiryDetails.mobileNumber,
                            message:  EnquiryDetails.message,
                            studentId: EnquiryDetails.studentId,
                            country: EnquiryDetails.country,
                            universityName: EnquiryDetails.universityName,
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
                            dial1: EnquiryDetails.dial1,
                            dial2:EnquiryDetails.dial2,
                         
                            modifiedOn: new Date(),
                            modifiedBy: EnquiryDetails.modifiedBy,
                        },
                        $addToSet: {
                            status: EnquiryDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await BusinessEnquiry.findById(EnquiryDetails._id);
                const user = updatedApplication.studentName
                const statusLength = updatedApplication.status.length;
                const currentDate = new Date();
                let delayMessages = []; // Array to store all delay messages

                if (statusLength > 1) {
                    for (let i = 0; i < statusLength - 1; i++) {
                        const statusCreatedOn = new Date(updatedApplication.status[i].createdOn);
                        const statusDurationInMs = Number(updatedApplication.status[i + 1].duration) * 24 * 60 * 60 * 1000;
                        const expectedCompletionDate = new Date(statusCreatedOn.getTime() + statusDurationInMs);

                        if (currentDate > expectedCompletionDate) {
                            const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));
                            delayMessages.push(`Delayed by ${delayDays} day(s) for status updated on ${statusCreatedOn.toDateString()}`);
                        }
                    }
                } else if (statusLength === 1) {
                    const applicationCreatedDate = new Date(updatedApplication.createdOn);
                    const lastStatus = updatedApplication.status[0];
                    const statusDurationInMs = Number(lastStatus.duration) * 24 * 60 * 60 * 1000;
                    const expectedCompletionDate = new Date(applicationCreatedDate.getTime() + statusDurationInMs);

                    if (currentDate > expectedCompletionDate) {
                        const delayDays = Math.ceil(Number(Number(currentDate) - Number(expectedCompletionDate)) / (24 * 60 * 60 * 1000));
                        delayMessages.push(`Delayed by ${delayDays} day(s) for initial application created on ${applicationCreatedDate.toDateString()}`);
                    }
                }

                const lastStatus = updatedApplication.status[statusLength - 1];
                const sanitizedContent = stripHtmlTags(lastStatus.commentBox);
                const docs = lastStatus.document;
                const Message = delayMessages[delayMessages.length - 1]
                const delayMessage = Message ? Message : "No Delay"

                // Update last status with delay message in the database
                await updatedApplication.updateOne({
                    $set: {
                        "status.$[elem].delay": delayMessage,
                        "status.$[elem].createdBy": user,
                        "status.$[statusElem].reply.$[replyElem].replyMessage": req.body.replyMessage,

                    }
                }, {
                    arrayFilters: [
                        // { "statusElem._id": req.body.statusId }, // Match the status by its _id
                        { "elem._id": lastStatus._id },
                        { "replyElem._id": req.body.replyId },   // Match the reply by its _id
                    ],

                });

                // Prepare email attachments
                const attachments = [];
                   let cid = ''
                if (docs) {
                    const [fileType, fileContent] = docs.split("base64,");
                    const extension = fileType ?? fileType.match(/\/(.*?);/)[1]; // Extract file extension (e.g., 'jpg', 'png', 'pdf')
                    const timestamp = format(new Date(), 'yyyyMMdd');
                    const dynamicFilename = `${sanitizedContent.replace(/\s+/g, '_')}_${timestamp}.${extension}`;
                    cid = `image_${Date.now()}.${extension}`; // Create a unique CID for the image

                    attachments.push({
                        filename: dynamicFilename,
                        content: docs.split("base64,")[1],
                        encoding: 'base64',
                        cid: cid
                    });
                }

                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: updatedApplication.email,
                    subject: "Business Enquiry Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                             Business Enquiry Status Updated
                                                          </td>
                                                      </tr>
                          
                                                      <!-- Body -->
                                                      <tr>
                                                          <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                              <p>Hello ${updatedApplication.studentName},</p>
                                                              <p>Your application status has been updated.</p>
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${lastStatus.statusName}</p>
                                                              <p>Comment: ${sanitizedContent}</p>
                                                                 <p>Delayed: ${delayMessage}</p>
        
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
                                                             Copyright &copy; ${new Date().getFullYear()} | All rights reserved
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

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email' });
                    } else {
                        console.log('Email sent:', info.response);
                        res.status(201).json({ message: 'You have received a Business Enquiry Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Business Enquiry status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'Business Enquiry not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Business Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Accommodation Enquiry', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateStatus = async (req, res) => {
    try {
        const { 
            statusId, statusName, progress, subCategory, completed, 
            duration, position, category, commentBox, document, reply 
        } = req.body;

        const sanitizedReply = Array.isArray(reply)
            ? reply.map(item => ({
                replyMessage: stripHtmlTags(item.replyMessage || ""),
          
            }))
            : [{ replyMessage: stripHtmlTags(reply || "")}];

        // Step 1: Set other status fields
        const updateResult = await BusinessEnquiry.findOneAndUpdate(
            { _id: req.body._id, "status._id": statusId },
            {
                $set: {
                    "status.$[elem].statusName": statusName,
                    "status.$[elem].progress": progress,
                    "status.$[elem].duration": duration,
                    "status.$[elem].subCategory": subCategory,
                    "status.$[elem].category": category,
                    "status.$[elem].position": position,
                    "status.$[elem].completed": completed,
                    "status.$[elem].commentBox": commentBox,
                    "status.$[elem].document": document,
                    "status.$[elem].modifiedOn": new Date(),
                }
            },
            {
                arrayFilters: [{ "elem._id": statusId }],
                new: true,
                runValidators: true
            }
        );

        if (!updateResult) {
            return res.status(404).json({ message: 'Status not found' });
        }

        // Step 2: Push the reply to the status reply array
        const pushResult = await BusinessEnquiry.findOneAndUpdate(
            { _id: req.body._id, "status._id": statusId },
            { $push: { "status.$.reply": { $each: sanitizedReply } } },
            { new: true }
        );

        if (!pushResult) {
            return res.status(404).json({ message: 'Failed to add reply.' });
        }

        // Return success response
        res.status(200).json({ message: 'Status updated successfully', data: pushResult });

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};