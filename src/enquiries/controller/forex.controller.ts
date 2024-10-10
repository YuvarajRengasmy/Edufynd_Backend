import { Forex, ForexDocument } from '../model/forex.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { response, transporter } from "../../helper/commonResponseHandler";
import { format } from 'date-fns';
import * as config from '../../config';


var activity = "ForexEnquiry";



export let getAllForexEnquiry = async (req, res, next) => {
    try {
        const data = await Forex.find({ isDeleted: false }).sort({ forexID: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Forex Enquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Forex Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleForexEnquiry = async (req, res, next) => {
    try {
        const forex = await Forex.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Forex Enquiry', true, 200, forex, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Forex Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let getAllLoggedForex = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Forex" })
        response(req, res, activity, 'Level-1', 'All-Logged Forex', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Forex', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedForex = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged Flight', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged Flight', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        return response(req, res, activity, 'Level-2', 'Single-Logged Flight', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


const generateNextForexId = async (): Promise<string> => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const forex = await Forex.find({}, 'forexID').exec();

    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.forexID;
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
    return `EF_${formattedCounter}`;
};

export let createForexEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const forexDetails: ForexDocument = req.body;
            forexDetails.createdOn = new Date();
            forexDetails.forexID = await generateNextForexId()
            const createData = new Forex(forexDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'Forex Enquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Forex Enquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Forex Enquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateForexEnquiryy = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const forexEnquiryDetails: ForexDocument = req.body;
            const updateData = await Forex.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    source: forexEnquiryDetails.source,
                    studentName: forexEnquiryDetails.studentName,
                    country: forexEnquiryDetails.country,
                    currency: forexEnquiryDetails.currency,
                    universityName: forexEnquiryDetails.universityName,
                    passportNo: forexEnquiryDetails.passportNo,
                    whatsAppNumber: forexEnquiryDetails.whatsAppNumber,
                    agentName: forexEnquiryDetails.agentName,
                    businessName: forexEnquiryDetails.businessName,
                    agentPrimaryNumber: forexEnquiryDetails.agentPrimaryNumber,
                    agentWhatsAppNumber: forexEnquiryDetails.agentWhatsAppNumber,
                    agentEmail: forexEnquiryDetails.agentEmail,
                    paymentType: forexEnquiryDetails.paymentType,
                    amountInCurrency: forexEnquiryDetails.amountInCurrency,
                    assignedTo: forexEnquiryDetails.assignedTo,
                    message: forexEnquiryDetails.message,
                    studentId: forexEnquiryDetails.studentId,
            
                    // New added Fields
                    expiryDate:forexEnquiryDetails.expiryDate,
                    courseType:forexEnquiryDetails.courseType,
                    value: forexEnquiryDetails.value,
                    markUp:forexEnquiryDetails.markUp,
                    profit: forexEnquiryDetails.profit,
                    dial1: forexEnquiryDetails.dial1,
                    dial2: forexEnquiryDetails.dial2,
                    dial3: forexEnquiryDetails.dial3,
                    dial4: forexEnquiryDetails.dial4,
                    name: forexEnquiryDetails.name,

                    modifiedOn: new Date(),
                    modifiedBy: forexEnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Forex Enquiry Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Forex Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Forex Enquiry Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteForexEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await Forex.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Forex Enquiry Details', true, 200, loan, 'Successfully Remove Forex Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Forex Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredForexEnquiry = async (req, res, next) => {
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
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.paymentType) {
            andList.push({ paymentType: req.body.paymentType })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const forexList = await Forex.find(findQuery).sort({ forexID: -1 }).limit(limit).skip(page).populate('staffId').populate('adminId').populate('studentId')

        const forexCount = await Forex.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Forex Enquiry', true, 200, { forexList, forexCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Forex Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export let activeForex= async (req, res, next) => {
    try {
        const forexIds = req.body.forexIds; 
  
        const forex = await Forex.updateMany(
            { _id: { $in: forexIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (forex.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-Forex ', true, 200, forex, 'Successfully Activated Forex .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-Forex ', false, 400, {}, 'Already Forex were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-Forex ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateForex = async (req, res, next) => {
    try {
        const forexIds = req.body.forexIds;   
      const forex = await Forex.updateMany(
        { _id: { $in: forexIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (forex.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-forex', true, 200, forex, 'Successfully deactivated forex.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-forex', false, 400, {}, 'Already forex were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-forex', false, 500, {}, 'Internal Server Error', err.message);
    }
  };


  export let assignStaffId = async (req, res, next) => {
    try {
        const { studentEnquiryIds, staffId,staffName } = req.body;  
        const user = await Forex.updateMany(
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


export let updateForexEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const forexEnquiryDetails: ForexDocument = req.body;
            const application = await Forex.findOne({ $and: [{ _id: { $ne: forexEnquiryDetails._id } }, { email: forexEnquiryDetails.email }] });

            if (!application) {
                const updateMaster = new Forex(forexEnquiryDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
                        $set: {
                            source: forexEnquiryDetails.source,
                            studentName: forexEnquiryDetails.studentName,
                            country: forexEnquiryDetails.country,
                            currency: forexEnquiryDetails.currency,
                            universityName: forexEnquiryDetails.universityName,
                            passportNo: forexEnquiryDetails.passportNo,
                            whatsAppNumber: forexEnquiryDetails.whatsAppNumber,
                            agentName: forexEnquiryDetails.agentName,
                            businessName: forexEnquiryDetails.businessName,
                            agentPrimaryNumber: forexEnquiryDetails.agentPrimaryNumber,
                            agentWhatsAppNumber: forexEnquiryDetails.agentWhatsAppNumber,
                            agentEmail: forexEnquiryDetails.agentEmail,
                            paymentType: forexEnquiryDetails.paymentType,
                            amountInCurrency: forexEnquiryDetails.amountInCurrency,
                            assignedTo: forexEnquiryDetails.assignedTo,
                            message: forexEnquiryDetails.message,
                            studentId: forexEnquiryDetails.studentId,
                    
                            // New added Fields
                            expiryDate:forexEnquiryDetails.expiryDate,
                            courseType:forexEnquiryDetails.courseType,
                            value: forexEnquiryDetails.value,
                            markUp:forexEnquiryDetails.markUp,
                            profit: forexEnquiryDetails.profit,
                            dial1: forexEnquiryDetails.dial1,
                            dial2: forexEnquiryDetails.dial2,
                            dial3: forexEnquiryDetails.dial3,
                            dial4: forexEnquiryDetails.dial4,
                            name: forexEnquiryDetails.name,
        
                            modifiedOn: new Date(),
                            modifiedBy: forexEnquiryDetails.modifiedBy,
                        },
                        $addToSet: {
                            status: forexEnquiryDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await Forex.findById(forexEnquiryDetails._id);
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
                    subject: "Forex Enquiry Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                             Forex Enquiry Status Updated
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
                        res.status(201).json({ message: 'You have received a Forex Enquiry Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Forex Enquiry status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'Forex Enquiry not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Forex Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Forex Enquiry', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};