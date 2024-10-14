import { GeneralEnquiry, GeneralEnquiryDocument } from '../model/generalEnquiry.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { response, transporter } from "../../helper/commonResponseHandler";
import { format } from 'date-fns';
import * as config from '../../config';
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

export let updateGeneralEnquiryy = async (req, res, next) => {
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



const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};

export let updateGeneralEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const EnquiryDetails: GeneralEnquiryDocument = req.body;
            const application = await GeneralEnquiry.findOne({ $and: [{ _id: { $ne: EnquiryDetails._id } }, { email: EnquiryDetails.email }] });

            if (!application) {
                const updateMaster = new GeneralEnquiry(EnquiryDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
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
                        },
                        $addToSet: {
                            status: EnquiryDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await GeneralEnquiry.findById(EnquiryDetails._id);
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
                    subject: "General Enquiry Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                             General Enquiry Status Updated
                                                          </td>
                                                      </tr>
                          
                                                      <!-- Body -->
                                                      <tr>
                                                          <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                                              <p>Hello ${updatedApplication.studentName},</p>
                                                              <p>Your application status has been updated.</p>
                                                              <p style="font-weight: bold,color: #345C72">Current Status: ${lastStatus.newStatus}</p>
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
                        res.status(201).json({ message: 'You have received a General Enquiry Status Notification' });
                    }
                });
                res.status(201).json({ message: 'General Enquiry status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'General Enquiry not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-General Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-General Enquiry', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
        const updateResult = await GeneralEnquiry.findOneAndUpdate(
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
        const pushResult = await GeneralEnquiry.findOneAndUpdate(
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