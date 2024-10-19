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

            const senderDetails: SenderInvoiceDocument = req.body;
            senderDetails.createdOn = new Date();
            senderDetails.senderInvoiceNumber = await generateSenderInvoice()

            // let final: any, courseValue: any, paidValue: any, fixedValue: any
            // if (senderInvoice.paymentMethod === "CourseFees") {
            //     let afterScholarship = Number(senderInvoice.courseFeesAmount) - (senderInvoice.scholarshipAmount ? senderInvoice.scholarshipAmount : 0)
            //     final = afterScholarship * (senderInvoice.courseFeesPercentage / 100)
            // } if (senderInvoice.paymentMethod === "PaidFees") {
            //     final = Number(senderInvoice.paidFeesAmount) * (senderInvoice.paidFeesPercentage / 100)
            // }
            // if (senderInvoice.paymentMethod === "Fixed") {
            //     final = Number(senderInvoice.fixedAmount)
            // }
         
            // // SenderInvoice.netAmount = courseValue ?? paidValue ?? fixedValue ?? 0
            // final = parseFloat(final);

            // console.log("l22", final)

            // senderInvoice.amountReceivedInCurrency = final || 0;
            // // console.log("kk",  SenderInvoice.amountReceivedInINR)
            // // let rate = Number((SenderInvoice.amountReceivedInINR) / final) || final
            // //   console.log("pp", rate)
            // // SenderInvoice.netAmount = rate;
            // // SenderInvoice.netInWords = toWords(rate).replace(/,/g, '') + ' only';

            const createData = new SenderInvoice(senderDetails);

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
    if (!errors.isEmpty()) {
        return response(req, res, null, 'Level-3', 'Update-SenderInvoice', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }

    try {
        const senderInvoice: SenderInvoiceDocument = req.body;
        
        // Ensure the sender invoice to be updated exists and isn't deleted
        const existingInvoice = await SenderInvoice.findOne({ 
            _id: { $ne: senderInvoice._id }
        });
console.log(existingInvoice)
        if (existingInvoice) {
            // Perform the update operation
            const updatedInvoice = await SenderInvoice.findByIdAndUpdate(
                senderInvoice._id,
                {
                    $set: {
                        tax: senderInvoice.tax,
                        gst: senderInvoice.gst,
                        tds: senderInvoice.tds,
                        clientName: senderInvoice.clientName,
                        universityName: senderInvoice.universityName,
                        applicationID: senderInvoice.applicationID,
                        currency: senderInvoice.currency,
                        commission: senderInvoice.commission,
                        amountReceivedInCurrency: senderInvoice.amountReceivedInCurrency,
                        date: senderInvoice.date,
                        courseFeeInINR: senderInvoice.courseFeeInINR,
                        finalValueInINR: senderInvoice.finalValueInINR,
                        modifiedOn: new Date(),
                    },
                    $addToSet: {
                        application: { $each: senderInvoice.application }, // Add applications only if they don't exist
                    }
                },
                { new: true }
            );

            response(req, res, null, 'Level-2', 'Update-SenderInvoice', true, 200, updatedInvoice, clientError.success.updateSuccess);
        } else {
            response(req, res, null, 'Level-3', 'Update-SenderInvoice', false, 422, {}, 'Invoice already exists with similar details.');
        }
    } catch (err) {
        response(req, res, null, 'Level-3', 'Update-SenderInvoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

// Update Application within Sender Invoice
export let updateApplication = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(req, res, null, 'Level-3', 'Update-Application', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }

    try {
        const senderInvoice: SenderInvoiceDocument = req.body;

        // Find the sender invoice
        const invoice = await SenderInvoice.findById(senderInvoice._id);

        if (invoice) {
            // Update the specific application within the applications array
            const updatedInvoice = await SenderInvoice.findByIdAndUpdate(
                senderInvoice._id,
                {
                    $set: {
                        'application.$[elem].applicationCode': senderInvoice.application.applicationCode,
                        'application.$[elem].courseFeesAmount': senderInvoice.application.courseFeesAmount,
                        'application.$[elem].course': senderInvoice.application.course,
                        'application.$[elem].universityName': senderInvoice.application.universityName,
                        'application.$[elem].commissionValue': senderInvoice.application.commissionValue,
                        'application.$[elem].presentValueInINR': senderInvoice.application.presentValueInINR,
                        'application.$[elem].amountReceivedInINR': senderInvoice.application.amountReceivedInINR
                    }
                },
                {
                    arrayFilters: [{ 'elem._id': senderInvoice.application._id }], // Find specific application by its _id
                    new: true // Return updated document
                }
            );

            response(req, res, null, 'Level-2', 'Update-Application', true, 200, updatedInvoice, 'Successfully updated application.');
        } else {
            response(req, res, null, 'Level-2', 'Update-Application', false, 404, {}, 'Sender Invoice not found.');
        }
    } catch (err) {
        response(req, res, null, 'Level-3', 'Update-Application', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let deleteSenderInvoice = async (req, res, next) => {

    try {
        let id = req.query._id;
        const invoice = await SenderInvoice.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Sender SenderInvoice', true, 200, invoice, 'Successfully Remove Sender Invoice Details');
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




