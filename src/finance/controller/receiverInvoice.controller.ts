import { ReceiverInvoice, ReceiverInvoiceDocument } from '../model/receiverInvoice.model'
import { SenderInvoice } from '../model/senderInvoice.model';
import { validationResult } from "express-validator";
import { response } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { toWords } from 'number-to-words';


var activity = "Receiver Invoice";



export let getAllReceiverInvoice = async (req, res, next) => {
    try {
        const data = await ReceiverInvoice.find();
        response(req, res, activity, 'Level-1', 'GetAll-Receiver Invoice', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Receiver Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleReceiverInvoice = async (req, res, next) => {
    try {
        const invoice = await ReceiverInvoice.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Receiver Invoice', true, 200, invoice, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Receiver Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
const generateReceiverInvoice = async (): Promise<string> => {
    // Retrieve all IDs to determine the highest existing applicant counter
    const invoice = await ReceiverInvoice.find({}, 'receiverInvoiceNumber').exec();

    const maxCounter = invoice.reduce((max, app) => {
        const appCode = app.receiverInvoiceNumber;
        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 0);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `RINV_${formattedCounter}`;
};



export let createReceiverInvoice = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const receiverInvoiceDetails: ReceiverInvoiceDocument = req.body;

            // Populate the senderId field to get the senderInvoice document
            const senderInvoice = await SenderInvoice.findById(receiverInvoiceDetails.senderId);

            if (!senderInvoice) {
                return response(req, res, activity, 'Level-3', 'Sender Invoice Not Found', false, 404, {}, "Not Found the Amount");
            }

            // Assign netAmount from senderInvoice to amountPaid in receiverInvoice
            let percent = senderInvoice.amountReceivedInCurrency;
            //  let rate = INR/Currency
            let currencyAmount = percent * (receiverInvoiceDetails.commission / 100)

            receiverInvoiceDetails.amountInCurrency = currencyAmount
            let INR = receiverInvoiceDetails.amountInINR / currencyAmount

            receiverInvoiceDetails.amount = INR
            // Calculation of GST
            let commissionReceived = receiverInvoiceDetails.amountInINR
            let withoutGST = commissionReceived / (118 * 100)
            let tds = withoutGST * (5 / 100)
            let netValue = withoutGST - tds
            receiverInvoiceDetails.netInWords = toWords(netValue).replace(/,/g, '') + ' only';
            const createData = new ReceiverInvoice(receiverInvoiceDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Receiver Invoice-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



// export let createReceiverInvoice = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {

//             const invoiceDetails: ReceiverInvoiceDocument = req.body;
//             invoiceDetails.createdOn = new Date();
//             invoiceDetails.invoiceNumber = await generateReceiverInvoice()
//             invoiceDetails.amountPaid = Number(Number(invoiceDetails.commission)/100) * invoiceDetails.amountPaid

//             const createData = new ReceiverInvoice(invoiceDetails);
//             let insertData = await createData.save();

//             response(req, res, activity, 'Level-2', 'Receiver Invoice-Created', true, 200, insertData, clientError.success.registerSuccessfully);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Receiver Invoice-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }

export let updateReceiverInvoice = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails: ReceiverInvoiceDocument = req.body;
            const updateData = await ReceiverInvoice.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    tax: invoiceDetails.tax,
                    gst: invoiceDetails.gst,
                    tds: invoiceDetails.tds,

                    agentName: invoiceDetails.agentName,
                    applicationID: invoiceDetails.applicationID,
                    universityName: invoiceDetails.universityName,
                    commission: invoiceDetails.commission,
                    amountPaid: invoiceDetails.amountPaid,
                    totalInvoiceAmount: invoiceDetails.totalInvoiceAmount,
                    transactions: invoiceDetails.transactions,
                    transactionsDate: invoiceDetails.transactionsDate,
                    amount: invoiceDetails.amount,
                    paymentMethod: invoiceDetails.paymentMethod,

                    modifiedOn: new Date(),
                    modifiedBy: invoiceDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-Receiver Invoice Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Receiver Invoice Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Receiver Invoice Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteReceiverInvoice = async (req, res, next) => {

    try {
        let id = req.query._id;
        const invoice = await ReceiverInvoice.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Receiver Invoice Details', true, 200, invoice, 'Successfully Remove Receiver Invoice Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Receiver Invoice Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredReceiverInvoice = async (req, res, next) => {
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
        if (req.body.agentName) {
            andList.push({ agentName: req.body.agentName })
        }
        if (req.body.applicationID) {
            andList.push({ applicationID: req.body.applicationID })
        }
        if (req.body.commission) {
            andList.push({ commission: req.body.commission })
        }
        if (req.body.paymentMethod) {
            andList.push({ paymentMethod: req.body.paymentMethod })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const invoiceList = await ReceiverInvoice.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const invoiceCount = await ReceiverInvoice.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Receiver Invoice', true, 200, { invoiceList, invoiceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Receiver Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



