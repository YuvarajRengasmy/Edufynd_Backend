import { SenderInvoice, SenderInvoiceDocument } from '../model/senderInvoice.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import { toWords } from 'number-to-words';


var activity = "Sender Invoice";



export let getAllSenderInvoice = async (req, res, next) => {
    try {
        const data = await SenderInvoice.find();
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
const generateSenderInvoice = async (): Promise<string> => {
    // Retrieve all IDs to determine the highest existing applicant counter
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

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `SINV_${formattedCounter}`;
};


// export let createSenderInvoice = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {

//             const invoiceDetails: SenderInvoiceDocument = req.body;
//             invoiceDetails.createdOn = new Date();
//             invoiceDetails.senderInvoiceNumber = await generateSenderInvoice()

//             let commissionReceived = Number(Number(invoiceDetails.amountReceivedInINRAndCurrency)/Number(invoiceDetails.amountToBeReceivedCurrency))
//             commissionReceived = parseFloat(commissionReceived.toFixed(2));
//              invoiceDetails.INRValue = commissionReceived

//             let final: any, courseValue: any, paidValue: any, fixedValue: any
        
//             if (invoiceDetails.paymentMethod === "CourseFees") {
//             let afterScholarship =  invoiceDetails.courseFeesAmount - (invoiceDetails.scholarshipAmount ? invoiceDetails.scholarshipAmount : 0)
//             courseValue = afterScholarship * (invoiceDetails.commission/100)
        

//             } if(invoiceDetails.paymentMethod === "PaidFees") {
//                 paidValue =invoiceDetails.paidFeesPercentage * (invoiceDetails.commission/100)
//             }
//              if(invoiceDetails.paymentMethod === "Fixed") {
//             fixedValue =invoiceDetails.fixedAmount
//         }

//             invoiceDetails.netAmount = courseValue ?? paidValue ?? fixedValue;
//             const createData = new SenderInvoice(invoiceDetails);
       
//             let insertData = await createData.save();

//             response(req, res, activity, 'Level-2', 'Sender Invoice-Created', true, 200, insertData, clientError.success.Sinvoice);
//         } catch (err: any) {
      
//             response(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }

export let createSenderInvoice = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const invoiceDetails: SenderInvoiceDocument = req.body;
            invoiceDetails.createdOn = new Date();
            invoiceDetails.senderInvoiceNumber = await generateSenderInvoice();

            const totalProgramFees = invoiceDetails.courseFeesAmount ?? 0;
            const scholarshipAmount = invoiceDetails.scholarshipAmount ?? 0;
            const fixedAmount = invoiceDetails.fixedAmount ?? 0;
            const commissionRate = invoiceDetails.commission ?? 0;
            const paidFeesPercentage = invoiceDetails.paidFeesPercentage ?? 0;
            const courseFeesPercentage = invoiceDetails.courseFeesPercentage ?? 0;

            // Initialize netAmount
            let netAmount = 0;

            // Calculate netAmount based on payment method
            if (fixedAmount > 0) {
                netAmount = fixedAmount;
            } else if (invoiceDetails.paymentMethod === "courseFeesAmount") {
                const afterScholarship = totalProgramFees - scholarshipAmount;
                netAmount = afterScholarship * (courseFeesPercentage / 100);
            } else if (invoiceDetails.paymentMethod === "paidFeesPercentage") {
                netAmount = totalProgramFees * (paidFeesPercentage / 100);
            } else {
                netAmount = totalProgramFees * (commissionRate / 100);
            }

            invoiceDetails.netAmount = parseFloat(netAmount.toFixed(2));

            const createData = new SenderInvoice(invoiceDetails);
            const insertData = await createData.save();

             response(req, res, activity, 'Level-2', 'Sender Invoice-Created', true, 200, insertData, clientError.success.registerSuccessfully);

        } catch (err: any) {
            response(req, res, 'Level-3', 'Sender Invoice-Created', false, 500, {}, errorMessage.internalServer, err.message);
}
    }
    else {
        response(req, res, 'Level-3', 'Sender Invoice-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

// export let createSenderInvoice = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {

//             const invoiceDetails: SenderInvoiceDocument = req.body;
//             invoiceDetails.createdOn = new Date();
//             invoiceDetails.senderInvoiceNumber = await generateSenderInvoice()

//             let commissionReceived = Number(Number(invoiceDetails.amountReceivedInINRAndCurrency)/Number(invoiceDetails.amountToBeReceivedCurrency))
//             commissionReceived = parseFloat(commissionReceived.toFixed(2));
//             invoiceDetails.INRValue = commissionReceived

//             let final;
//             // Now, GST and TDS calculated
//             if (invoiceDetails.tax === "yes") {
//                 const withoutGST = commissionReceived / 1.18;
//                 const addGST = withoutGST * 0.18;
//                 const addTDS = withoutGST * 0.05;
//                 final = commissionReceived - addTDS;
//             } else {
//                 const addGST = commissionReceived * 0.18;
//                 const addTDS = commissionReceived * 0.05;
//                 final = commissionReceived - addTDS;
//             }

//             final = parseFloat(final.toFixed(2));
//             invoiceDetails.netAmount = final;
//             invoiceDetails.netInWords = toWords(final).replace(/,/g, '') + ' only';


//             const createData = new SenderInvoice(invoiceDetails);
//             let insertData = await createData.save();

//             response(req, res, activity, 'Level-2', 'Sender Invoice-Created', true, 200, insertData, clientError.success.registerSuccessfully);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Sender Invoice-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }

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
                  
                    businessName:invoiceDetails.businessName,
                    universityName: invoiceDetails.universityName,
                    applicationID: invoiceDetails.applicationID,
                    currency: invoiceDetails.currency,
                    commission: invoiceDetails.commission,
                    amountToBeReceivedCurrency: invoiceDetails.amountToBeReceivedCurrency,
                    amountReceivedInINRAndCurrency: invoiceDetails.amountReceivedInINRAndCurrency,
                    INRValue: invoiceDetails.INRValue,
                    date: invoiceDetails.date,

                    modifiedOn: new Date(),
                    modifiedBy: invoiceDetails.modifiedBy,
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

        const invoiceList = await SenderInvoice.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const invoiceCount = await SenderInvoice.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Sender Invoice', true, 200, { invoiceList, invoiceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Sender Invoice', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



