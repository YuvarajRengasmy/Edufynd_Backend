import { LoanEnquiry, LoanEnquiryDocument } from '../model/loanEnquiry.model'
import { Logs } from "../../model/logs.model";
import { validationResult } from "express-validator";
import { response, transporter } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { format } from 'date-fns';
import * as config from '../../config';


var activity = "LoanEnquiry";


export let getAllLoanEnquiry = async (req, res, next) => {
    try {
        const data = await LoanEnquiry.find({ isDeleted: false }).sort({ loanID: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-LoanEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-LoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleLoanEnquiry = async (req, res, next) => {
    try {
        const student = await LoanEnquiry.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-LoanEnquiry', true, 200, student, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-LoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let getAllLoggedLoanEnquiry = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "LoanEnquiry" })
        response(req, res, activity, 'Level-1', 'All-Logged LoanEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged LoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


  export let getSingleLoggedLoanEnquiry  = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        return response(req, res, activity, 'Level-3', 'Single-Logged LoanEnquiry', false, 404, {},"No logs found.");
      }
  
      return response(req, res, activity, 'Level-1', 'Single-Logged LoanEnquiry', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
        return response(req, res, activity, 'Level-2', 'Single-Logged LoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }



const generateNextLoanID = async (): Promise<string> => {
    const loan = await LoanEnquiry.find({}, 'loanID').exec();

    const maxCounter = loan.reduce((max, app) => {
        const appCode = app.loanID;
        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 100);
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `EL_${formattedCounter}`;
};


export let createLoanEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const enquiryDetails: LoanEnquiryDocument = req.body;
            enquiryDetails.createdOn = new Date();
            enquiryDetails.loanID = await generateNextLoanID()
            const createData = new LoanEnquiry(enquiryDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'LoanEnquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'LoanEnquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'LoanEnquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateLoanEnquiryy = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const loanEnquiryDetails: LoanEnquiryDocument = req.body;
            const updateData = await LoanEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    studentName: loanEnquiryDetails.studentName,
                    whatsAppNumber: loanEnquiryDetails.whatsAppNumber,
                    email: loanEnquiryDetails.email,
                    doYouHaveAValidOfferFromAnyUniversity: loanEnquiryDetails.doYouHaveAValidOfferFromAnyUniversity,
                    uploadOfferletter: loanEnquiryDetails.uploadOfferletter,
                    loanAmountRequired: loanEnquiryDetails.loanAmountRequired,
                    desiredCountry: loanEnquiryDetails.desiredCountry,
                    whatIsYourMonthlyIncome: loanEnquiryDetails.whatIsYourMonthlyIncome,
                    passportNumber: loanEnquiryDetails.passportNumber,
                    expiryDate: loanEnquiryDetails.expiryDate,
                    uploadPassport: loanEnquiryDetails.uploadPassport,
                    didYouApplyForLoanElsewhere: loanEnquiryDetails.didYouApplyForLoanElsewhere,
                    chooseTheBankYouPreviouslyApplied: loanEnquiryDetails.chooseTheBankYouPreviouslyApplied,
                    statusOfPreviousApplication: loanEnquiryDetails.statusOfPreviousApplication,
                    coApplicantName: loanEnquiryDetails.coApplicantName,
                    age: loanEnquiryDetails.age,
                    employmentStatus: loanEnquiryDetails.employmentStatus,
                    incomeDetails: loanEnquiryDetails.incomeDetails,
                    willyouSubmitYourCollateral: loanEnquiryDetails.willyouSubmitYourCollateral,
                    message: loanEnquiryDetails.message,
                    studentId: loanEnquiryDetails.studentId,
                    country: loanEnquiryDetails.country,
                    universityName: loanEnquiryDetails.universityName,

                    //Newly Added
                    studentCode: loanEnquiryDetails.studentCode,
                    agentPrimaryNo: loanEnquiryDetails.agentPrimaryNo,
                    agentWhatsAppNo:loanEnquiryDetails.agentWhatsAppNo,
                    agentMail:loanEnquiryDetails.agentMail,
                    plannedUniversity: loanEnquiryDetails.plannedUniversity,
                    courseFee: loanEnquiryDetails.courseFee,
                    preferedLoanType: loanEnquiryDetails.preferedLoanType,
                    previousLoanApplied: loanEnquiryDetails.previousLoanApplied,
                    whatIsYourLoanHistory: loanEnquiryDetails.whatIsYourLoanHistory,
                    coApplicantMail: loanEnquiryDetails.coApplicantMail,
                    coApplicantPrimaryNo: loanEnquiryDetails.coApplicantPrimaryNo,
                    coApplicantWhatsAppNo: loanEnquiryDetails.coApplicantWhatsAppNo,
                    relationship: loanEnquiryDetails.relationship,
                    dial1: loanEnquiryDetails.dial1,
                    dial2: loanEnquiryDetails.dial2,
                    dial3:loanEnquiryDetails.dial3,
                    dial4: loanEnquiryDetails.dial4,
                    dial5: loanEnquiryDetails.dial5,
                    dial6: loanEnquiryDetails.dial6,


                    modifiedOn: new Date(),
                    modifiedBy: loanEnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-LoanEnquiryDetails', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteLoanEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await LoanEnquiry.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Loan Enquiry Details', true, 200, loan, 'Successfully Remove Loan Enquiry Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Loan Enquiry Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredLoanEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        // andList.push({ status: 1 })
        if (req.body.desiredCountry) {
            andList.push({ desiredCountry: req.body.desiredCountry })
        }
        if (req.body.staffId) {
            andList.push({ staffId: req.body.staffId });
        }
        if (req.body.adminId) {
            andList.push({ adminId: req.body.adminId });
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
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const loanList = await LoanEnquiry.find(findQuery).sort({ loanID: -1 }).limit(limit).skip(page).populate('staffId').populate('adminId').populate('studentId')

        const loanCount = await LoanEnquiry.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterLoanEnquiry', true, 200, { loanList, loanCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterLoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let activeLoanEnquiry= async (req, res, next) => {
    try {
        const loanEnquiryIds = req.body.loanEnquiryIds; 
  
        const loan = await LoanEnquiry.updateMany(
            { _id: { $in: loanEnquiryIds } }, 
            { $set: { isActive: "Active" } }, 
            { new: true }
        );
  
        if (loan.modifiedCount > 0) {
            response(req, res, activity, 'Level-2', 'Active-LoanEnquiry ', true, 200, loan, 'Successfully Activated LoanEnquiry .');
        } else {
            response(req, res, activity, 'Level-3', 'Active-LoanEnquiry ', false, 400, {}, 'Already LoanEnquiry were Activated.');
        }
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Active-LoanEnquiry ', false, 500, {}, 'Internal Server Error', err.message);
    }
  };
  
  
  export let deactivateLoanEnquiry = async (req, res, next) => {
    try {
        const loanEnquiryIds = req.body.loanEnquiryIds;  
      const loan = await LoanEnquiry.updateMany(
        { _id: { $in: loanEnquiryIds } }, 
        { $set: { isActive: "InActive" } }, 
        { new: true }
      );
  
      if (loan.modifiedCount > 0) {
        response(req, res, activity, 'Level-2', 'Deactivate-LoanEnquiry', true, 200, loan, 'Successfully deactivated LoanEnquiry.');
      } else {
        response(req, res, activity, 'Level-3', 'Deactivate-LoanEnquiry', false, 400, {}, 'Already LoanEnquiry were deactivated.');
      }
    } catch (err) {
      response(req, res, activity, 'Level-3', 'Deactivate-LoanEnquiry', false, 500, {}, 'Internal Server Error', err.message);
    }
  };



  export let assignStaffId = async (req, res, next) => {
    try {
        const { loanEnquiryIds, staffId,staffName } = req.body;  
        const user = await LoanEnquiry.updateMany(
            { _id: { $in: loanEnquiryIds } }, 
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

export let updateLoanEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const loanEnquiryDetails: LoanEnquiryDocument = req.body;
            const application = await LoanEnquiry.findOne({ $and: [{ _id: { $ne: loanEnquiryDetails._id } }, { email: loanEnquiryDetails.email }] });

            if (!application) {
                const updateMaster = new LoanEnquiry(loanEnquiryDetails)
                let updatedApplicant = await updateMaster.updateOne(
                    {
                        $set: {
                            studentName: loanEnquiryDetails.studentName,
                    whatsAppNumber: loanEnquiryDetails.whatsAppNumber,
                    email: loanEnquiryDetails.email,
                    doYouHaveAValidOfferFromAnyUniversity: loanEnquiryDetails.doYouHaveAValidOfferFromAnyUniversity,
                    uploadOfferletter: loanEnquiryDetails.uploadOfferletter,
                    loanAmountRequired: loanEnquiryDetails.loanAmountRequired,
                    desiredCountry: loanEnquiryDetails.desiredCountry,
                    whatIsYourMonthlyIncome: loanEnquiryDetails.whatIsYourMonthlyIncome,
                    passportNumber: loanEnquiryDetails.passportNumber,
                    expiryDate: loanEnquiryDetails.expiryDate,
                    uploadPassport: loanEnquiryDetails.uploadPassport,
                    didYouApplyForLoanElsewhere: loanEnquiryDetails.didYouApplyForLoanElsewhere,
                    chooseTheBankYouPreviouslyApplied: loanEnquiryDetails.chooseTheBankYouPreviouslyApplied,
                    statusOfPreviousApplication: loanEnquiryDetails.statusOfPreviousApplication,
                    coApplicantName: loanEnquiryDetails.coApplicantName,
                    age: loanEnquiryDetails.age,
                    employmentStatus: loanEnquiryDetails.employmentStatus,
                    incomeDetails: loanEnquiryDetails.incomeDetails,
                    willyouSubmitYourCollateral: loanEnquiryDetails.willyouSubmitYourCollateral,
                    message: loanEnquiryDetails.message,
                    studentId: loanEnquiryDetails.studentId,
                    country: loanEnquiryDetails.country,
                    universityName: loanEnquiryDetails.universityName,

                    //Newly Added
                    studentCode: loanEnquiryDetails.studentCode,
                    agentPrimaryNo: loanEnquiryDetails.agentPrimaryNo,
                    agentWhatsAppNo:loanEnquiryDetails.agentWhatsAppNo,
                    agentMail:loanEnquiryDetails.agentMail,
                    plannedUniversity: loanEnquiryDetails.plannedUniversity,
                    courseFee: loanEnquiryDetails.courseFee,
                    preferedLoanType: loanEnquiryDetails.preferedLoanType,
                    previousLoanApplied: loanEnquiryDetails.previousLoanApplied,
                    whatIsYourLoanHistory: loanEnquiryDetails.whatIsYourLoanHistory,
                    coApplicantMail: loanEnquiryDetails.coApplicantMail,
                    coApplicantPrimaryNo: loanEnquiryDetails.coApplicantPrimaryNo,
                    coApplicantWhatsAppNo: loanEnquiryDetails.coApplicantWhatsAppNo,
                    relationship: loanEnquiryDetails.relationship,
                    dial1: loanEnquiryDetails.dial1,
                    dial2: loanEnquiryDetails.dial2,
                    dial3:loanEnquiryDetails.dial3,
                    dial4: loanEnquiryDetails.dial4,
                    dial5: loanEnquiryDetails.dial5,
                    dial6: loanEnquiryDetails.dial6,

                    modifiedOn: new Date(),
                    modifiedBy: loanEnquiryDetails.modifiedBy
                        },
                        $addToSet: {
                            status: loanEnquiryDetails.status
                        }
                    }
                );


                // Delay days Calculation
                const updatedApplication = await LoanEnquiry.findById(loanEnquiryDetails._id);
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
                    subject: "Loan Enquiry Status Updated",
                    html: `
                                  <body style="font-family: 'Poppins', Arial, sans-serif">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                              <td align="center" style="padding: 20px;">
                                                  <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                                                      <!-- Header -->
                                                      <tr>
                                                          <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                                                            Loan Enquiry Status Updated
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
                        res.status(201).json({ message: 'You have received a Loan Enquiry Status Notification' });
                    }
                });
                res.status(201).json({ message: 'Loan Enquiry status has been updated and emails sent.', Details: updatedApplication });

            } else {
                res.status(404).json({ message: 'Loan Enquiry not found' });
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Loan Enquiry', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Loan Enquiry', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
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
        const updateResult = await LoanEnquiry.findOneAndUpdate(
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
        const pushResult = await LoanEnquiry.findOneAndUpdate(
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