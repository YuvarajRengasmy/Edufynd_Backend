import { SenderInvoice, SenderInvoiceDocument } from '../model/senderInvoice.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { toWords } from 'number-to-words';


var activity = "Sender Invoice";



export let getAllSenderInvoice = async (req, res, next) => {
    try {
        const data = await SenderInvoice.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Sender Invoice', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Sender Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleSenderInvoice = async (req, res, next) => {
    try {
        const invoice = await SenderInvoice.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Sender Invoice', true, 200, invoice, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Sender Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
const generateSenderInvoice = async () => {
    const forex = await SenderInvoice.find({}, 'senderInvoiceNumber').exec();
    const maxCounter = forex.reduce((max, app) => {
        const appCode = app.senderInvoiceNumber;
        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 0);
    const newCounter = maxCounter + 1;
    const formattedCounter = String(newCounter).padStart(3, '0');
    return `SINV_${formattedCounter}`;
};


export let createSenderInvoice = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const invoiceDetails: SenderInvoiceDocument = req.body;
            invoiceDetails.createdOn = new Date();
            invoiceDetails.senderInvoiceNumber = await generateSenderInvoice()

            let final: any, courseValue: any, paidValue: any, fixedValue: any
            if (invoiceDetails.paymentMethod === "CourseFees") {
                let afterScholarship = Number(invoiceDetails.courseFeesAmount) - (invoiceDetails.scholarshipAmount ? invoiceDetails.scholarshipAmount : 0)
                final = afterScholarship * (invoiceDetails.courseFeesPercentage / 100)
            } if (invoiceDetails.paymentMethod === "PaidFees") {
                final = Number(invoiceDetails.paidFeesAmount) * (invoiceDetails.paidFeesPercentage / 100)
            }
            if (invoiceDetails.paymentMethod === "Fixed") {
                final = Number(invoiceDetails.fixedAmount)
            }
            console.log("ll", final)
            // invoiceDetails.netAmount = courseValue ?? paidValue ?? fixedValue ?? 0
            final = parseFloat(final.toFixed(2));

            console.log("l22", final)

            invoiceDetails.amountReceivedInCurrency = final || 0;
            // console.log("kk",  invoiceDetails.amountReceivedInINR)
            // let rate = Number((invoiceDetails.amountReceivedInINR) / final) || final
            //   console.log("pp", rate)
            // invoiceDetails.netAmount = rate;
            // invoiceDetails.netInWords = toWords(rate).replace(/,/g, '') + ' only';

            const createData = new SenderInvoice(invoiceDetails);

            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'Sender Invoice-Created', true, 200, insertData, clientError.success.Sinvoice);
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



export let updateSenderInvoice = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails: SenderInvoiceDocument = req.body;
            const updateData = await SenderInvoice.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    tax: invoiceDetails.tax,
                    gst: invoiceDetails.gst,
                    tds: invoiceDetails.tds,

                    clientName: invoiceDetails.clientName,
                    universityName: invoiceDetails.universityName,
                    applicationID: invoiceDetails.applicationID,
                    currency: invoiceDetails.currency,
                    commission: invoiceDetails.commission,
                    amountReceivedInCurrency: invoiceDetails.amountReceivedInCurrency,

                    // INRValue: invoiceDetails.INRValue,    
                    date: invoiceDetails.date,
                    courseFeeInINR: invoiceDetails.courseFeeInINR,
                    finalValueInINR: invoiceDetails.finalValueInINR,

                    modifiedOn: new Date(),

                },
                $addToSet: {
                    application: invoiceDetails.application,

                }

            });
            response(req, res, activity, 'Level-2', 'Update-Sender Invoice Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Sender Invoice Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Sender Invoice Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteSenderInvoice = async (req, res, next) => {

    try {
        let id = req.query._id;
        const invoice = await SenderInvoice.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Sender InvoiceDetails', true, 200, invoice, 'Successfully Remove Sender Invoice Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Sender Invoice Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredSenderInvoice = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.universityName) {
            andList.push({ universityName: req.body.universityName })
        }
        if (req.body.clientName) {
            andList.push({ clientName: req.body.clientName })
        }
        if (req.body.applicationID) {
            andList.push({ applicationID: req.body.applicationID })
        }
        if (req.body.currency) {
            andList.push({ currency: req.body.currency })
        }
        if (req.body.INRValue) {
            andList.push({ INRValue: req.body.INRValue })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const invoiceList = await SenderInvoice.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const invoiceCount = await SenderInvoice.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Sender Invoice', true, 200, { invoiceList, invoiceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Sender Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



export const updateSenderApplication = async (req, res) => {
    try {
        const { amountReceivedInINR, commissionValue, presentValue, applicationId } = req.body;


        // Step 1: Set other status fields
        const updateResult = await SenderInvoice.findOneAndUpdate(
            { _id: req.body._id, "application._id": applicationId },
            {
                $set: {
                    "status.$[elem].amountReceivedInINR": amountReceivedInINR,
                    "status.$[elem].commissionValue": commissionValue,
                    "status.$[elem].presentValue": presentValue,

                }
            },
            {
                arrayFilters: [{ "elem._id": applicationId }],
                new: true,
                runValidators: true
            }
        );

        if (!updateResult) {
            return res.status(404).json({ message: 'Status not found' });
        }
        // Return success response
        res.status(200).json({ message: 'Status updated successfully', data: updateResult });

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};





export const updateSenderInvoiceAndApplication = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(req,res, 'activity','Level-3','Update-Sender Invoice Details',false,422,{},errorMessage.fieldValidation,JSON.stringify(errors.mapped())
        );
    }

    const {
        _id, // Invoice ID
        tax, gst, tds, clientName, universityName,
        applicationID, currency, commission, amountReceivedInCurrency,
        date, courseFeeInINR, finalValueInINR, application,
        amountReceivedInINR, commissionValue, presentValue, applicationId,
    } = req.body;

    try {
        // 1. Handle General Invoice Update
        let updateFields = {
            tax, gst, tds, clientName, universityName, applicationID,
            currency, commission, amountReceivedInCurrency, date,
            courseFeeInINR, finalValueInINR, modifiedOn: new Date(),
        };

        // If `application` array is provided, add it to $addToSet
        const updateOptions = application
            ? { $set: updateFields, $addToSet: { application } }
            : { $set: updateFields };

        let updateResult = await SenderInvoice.findOneAndUpdate(
            { _id },
            updateOptions,
            { new: true }
        );

        // 2. Handle Application Array Update (if applicationId is provided)
        if (applicationId) {
            updateResult = await SenderInvoice.findOneAndUpdate(
                { _id, "application._id": applicationId },
                {
                    $set: {
                        "application.$[elem].amountReceivedInINR": amountReceivedInINR,
                        "application.$[elem].commissionValue": commissionValue,
                        "application.$[elem].presentValue": presentValue,
                    },
                },
                {
                    arrayFilters: [{ "elem._id": applicationId }],
                    new: true,
                    runValidators: true,
                }
            );

            if (!updateResult) {
                return res.status(404).json({ message: "Application not found" });
            }
        }

        // Success Response
        response(req,res,'activity','Level-2','Update-Sender Invoice Details',true,200,updateResult, clientError.success.updateSuccess);

    } catch (error) {
        console.error("Error updating sender invoice:", error);
        response(req,res,'activity','Level-3','Update-Sender Invoice Details',false,500,{},errorMessage.internalServer,error.message);
    }
};
