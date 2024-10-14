import { Flight, FlightDocument } from '../model/flightTicket.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { response, transporter } from "../../helper/commonResponseHandler";
import { format } from 'date-fns';
import * as config from '../../config';


var activity = "FlightTicketEnquiry";



export let getAllFlightTicketEnquiry = async (req, res, next) => {
    try {
        const data = await Flight.find({ isDeleted: false }).sort({ flightID: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Flight Ticket Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Flight Ticket Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleFlightTicketEnquiry = async (req, res, next) => {
    try {
        const flight = await Flight.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Flight Ticket Enquiry', true, 200, flight, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Flight Ticket Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let getAllLoggedFlight = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "FlightTicket" })
        response(req, res, activity, 'Level-1', 'All-Logged Flight', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Flight', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedFlight = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged Flight', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged Flight', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        return  response(req, res, activity, 'Level-2', 'Single-Logged Flight', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


const generateNextFlightId = async (): Promise<string> => {
    const forex = await Flight.find({}, 'flightID').exec();

    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.flightID;
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
    return `ET_${formattedCounter}`;
};



export let createFlightTicketEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const flightDetails: FlightDocument = req.body;
            flightDetails.createdOn = new Date();
            flightDetails.flightID = await generateNextFlightId()
            const createData = new Flight(flightDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'Flight Ticket Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Flight Ticket Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Flight Ticket Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateFlightTicketEnquiryy = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const flightEnquiryDetails: FlightDocument = req.body;
            const updateData = await Flight.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                
                    source:flightEnquiryDetails.source,
                    studentName: flightEnquiryDetails.studentName,
                    passportNo: flightEnquiryDetails.passportNo,
                    expiryDate: flightEnquiryDetails.expiryDate,
                    dob: flightEnquiryDetails.dob,
                    whatsAppNumber: flightEnquiryDetails.whatsAppNumber,
                    agentName: flightEnquiryDetails.agentName,
                    businessName: flightEnquiryDetails.businessName,
                    agentWhatsAppNumber: flightEnquiryDetails.agentWhatsAppNumber,
                    from: flightEnquiryDetails.from,
                    to: flightEnquiryDetails.to,
                    dateOfTravel: flightEnquiryDetails.dateOfTravel,
                    message: flightEnquiryDetails.message,
                    studentId: flightEnquiryDetails.studentId,
                    country: flightEnquiryDetails.country,
                    universityName: flightEnquiryDetails.universityName,
                    dial1: flightEnquiryDetails.dial1,
                    dial2: flightEnquiryDetails.dial2,
                    dial3: flightEnquiryDetails.dial3,
                    dial4: flightEnquiryDetails.dial4,
                    name: flightEnquiryDetails.name,
                    modifiedOn: new Date(),
                    modifiedBy:flightEnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Flight Ticket Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Flight Ticket Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Flight Ticket Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteFlightTicketEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await Flight.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Flight Ticket Enquiry Details', true, 200, loan, 'Successfully Remove Flight Ticket Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Flight Ticket Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredFlightTicketEnquiry = async (req, res, next) => {
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
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName })
        }
        if (req.body.from) {
            andList.push({ from: req.body.from })
        }
        if (req.body.to) {
            andList.push({ to: req.body.to })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const flightList = await Flight.find(findQuery).sort({ flightID: -1 }).limit(limit).skip(page).populate({ path: 'adminId', select: 'name' }).populate({ path: 'staffId', select: 'name' })

        const flightCount = await Flight.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Flight Ticket Enquiry', true, 200, { flightList, flightCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Flight Ticket  Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let activeFlight = async (req, res, next) => {
    try {
        const flightIds = req.body.flightIds; 
  
        const flight = await Flight.updateMany(
            { _id: { $in: flightIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (flight.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-FlightEnquiry ', true, 200, flight, 'Successfully Activated FlightEnquiry .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-FlightEnquiry ', false, 400, {}, 'Already FlightEnquiry were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-FlightEnquiry ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateFlight = async (req, res, next) => {
    try {
        const flightIds = req.body.flightIds;   
      const flight = await Flight.updateMany(
        { _id: { $in: flightIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (flight.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-FlightEnquiry', true, 200, flight, 'Successfully deactivated Flight.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-FlightEnquiry', false, 400, {}, 'Already Flight were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-FlightEnquiry', false, 500, {}, 'Internal Server Error', err.message);
    }
  };


  export let assignStaffId = async (req, res, next) => {
    try {
        const { studentEnquiryIds, staffId,staffName } = req.body;  


        const user = await Flight.updateMany(
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

export let updateFlightTicketEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const flightEnquiryDetails: FlightDocument = req.body;
            const application = await Flight.findOne({ $and: [{ _id: { $ne: flightEnquiryDetails._id } }, { email: flightEnquiryDetails.email }] });

            if (!application) {
                const updateMaster = new Flight(flightEnquiryDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
                        $set: {
                            source:flightEnquiryDetails.source,
                            studentName: flightEnquiryDetails.studentName,
                            passportNo: flightEnquiryDetails.passportNo,
                            expiryDate: flightEnquiryDetails.expiryDate,
                            dob: flightEnquiryDetails.dob,
                            whatsAppNumber: flightEnquiryDetails.whatsAppNumber,
                            agentName: flightEnquiryDetails.agentName,
                            businessName: flightEnquiryDetails.businessName,
                            agentWhatsAppNumber: flightEnquiryDetails.agentWhatsAppNumber,
                            from: flightEnquiryDetails.from,
                            to: flightEnquiryDetails.to,
                            dateOfTravel: flightEnquiryDetails.dateOfTravel,
                            message: flightEnquiryDetails.message,
                            studentId: flightEnquiryDetails.studentId,
                            country: flightEnquiryDetails.country,
                            universityName: flightEnquiryDetails.universityName,
                            dial1: flightEnquiryDetails.dial1,
                            dial2: flightEnquiryDetails.dial2,
                            dial3: flightEnquiryDetails.dial3,
                            dial4: flightEnquiryDetails.dial4,
                            name: flightEnquiryDetails.name,
                            modifiedOn: new Date(),
                            modifiedBy:flightEnquiryDetails.modifiedBy,
                        },
                        $addToSet: {
                            status: flightEnquiryDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await Flight.findById(flightEnquiryDetails._id);
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
                    subject: "Flight Enquiry Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                             Flight Enquiry Status Updated
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
                        res.status(201).json({ message: 'You have received a Flight Enquiry Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Flight Enquiry status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'Flight Enquiry not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Flight Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Flight Enquiry', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
        const updateResult = await Flight.findOneAndUpdate(
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
        const pushResult = await Flight.findOneAndUpdate(
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