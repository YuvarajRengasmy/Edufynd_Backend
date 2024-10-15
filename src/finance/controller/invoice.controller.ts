import { Invoice, InvoiceDocument } from '../model/invoice.model'
import { ReceiverInvoice, ReceiverInvoiceDocument } from '../model/receiverInvoice.model'
import { validationResult } from "express-validator";
import { response } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { toWords } from 'number-to-words';


var activity = "Invoice";



export let getAllInvoice = async (req, res, next) => {
    try {
        const data = await Invoice.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Invoice', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Invoice', true, 200, invoice, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
}
const generateReceiverInvoice = async () => {
    // Retrieve all IDs to determine the highest existing applicant counter
    const invoice = await Invoice.find({}, 'invoiceNumber').exec();

    const maxCounter = invoice.reduce((max, app) => {
        const appCode = app.invoiceNumber;
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
    return `INV_${formattedCounter}`;
};



export let createInvoice = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails: InvoiceDocument = req.body;

            // Populate the ReceiverId field to get the Receiver Invoice document
            const receiverInvoice = await ReceiverInvoice.findById(invoiceDetails.receiverId);

            if (!receiverInvoice) {
                return response(req, res, activity, 'Level-3', 'Receiver Invoice Not Found', false, 404, {}, "Not Found the ID's");
            }
            let rate = receiverInvoice.amount
        
            // Calculation of GST
            invoiceDetails.commissionReceived = rate
            let withoutGST = rate / (118 * 100)
            let tds = withoutGST * (5 / 100)
            let netValue = withoutGST - tds
            receiverInvoice.netInWords = toWords(netValue).replace(/,/g, '') + ' only';
            const createData = new Invoice(receiverInvoice);
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



export let updateInvoice = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails: InvoiceDocument = req.body;
            const updateData = await Invoice.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    tax: invoiceDetails.tax,
                    gst: invoiceDetails.gst,
                    tds: invoiceDetails.tds,
                    clientName:invoiceDetails.clientName,
                    INRValue: invoiceDetails.INRValue,
                    agentName: invoiceDetails.agentName,
                    applicationID: invoiceDetails.applicationID,
                    universityName: invoiceDetails.universityName,
                    commissionReceived: invoiceDetails.commissionReceived,
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
            response(req, res, activity, 'Level-2', 'Update-Invoice Details', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Invoice Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Invoice Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deleteInvoice = async (req, res, next) => {

    try {
        let id = req.query._id;
        const invoice = await Invoice.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-Invoice Details', true, 200, invoice, 'Successfully Remove Invoice Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Invoice Details', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredInvoice = async (req, res, next) => {
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

        const invoiceList = await Invoice.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

        const invoiceCount = await Invoice.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Invoice', true, 200, { invoiceList, invoiceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



