import { Accommodation, AccommodationDocument } from '../model/accommodation.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { response, transporter } from "../../helper/commonResponseHandler";
import { format } from 'date-fns';
import * as config from '../../config';


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



const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
};


export let updateAccommodationStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const accommodationDetails: AccommodationDocument = req.body;
            
                // Delay days Calculation
                const updatedApplication = await Accommodation.findById(accommodationDetails._id);
                const user = updatedApplication.studentName
                const statusLength = updatedApplication.status.length;
                const currentDate = new Date();
                let delayMessages = []; // Array to store all delay messages

                console.log("ppp", statusLength)

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
                const sanitizedContent = stripHtmlTags(lastStatus?.commentBox || "");
                const docs = lastStatus?.document || "";
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
                        { "elem._id": lastStatus?._id },
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
                    subject: "Accommodation Enquiry Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                             Accommodation Enquiry Status Updated
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
                        res.status(201).json({ message: 'You have received a Accommodation Enquiry Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Accommodation Enquiry status has been updated and emails sent.', Details: updatedApplication });


        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Accommodation Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Accommodation Enquiry', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


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
        const updateResult = await Accommodation.findOneAndUpdate(
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
        const pushResult = await Accommodation.findOneAndUpdate(
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