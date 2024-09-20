import { Payment, PaymentDocument } from '../model/payment.model'
import { Logs } from "../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import * as config from '../config';
var activity = "Payment";



export const getAllPayment = async (req, res) => {
    try {
        const data = await Payment.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Payment', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Payment', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

export let getAllLoggedPayment = async (req, res, next) => {
    try {
        const data = await Logs.find({ modelName: "Payment" })
        response(req, res, activity, 'Level-1', 'All-Logged Payment', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'All-Logged Payment', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };

  export let getSingleLoggedPayment = async (req, res) => {
    try {
      const {_id } = req.query
      const logs = await Logs.find({ documentId: _id });
  
      if (!logs || logs.length === 0) {
        response(req, res, activity, 'Level-3', 'Single-Logged Payment', false, 404, {},"No logs found.");
      }
  
      response(req, res, activity, 'Level-1', 'Single-Logged Payment', true, 200, logs, clientError.success.fetchedSuccessfully);
    } catch (err) {
      response(req, res, activity, 'Level-2', 'Single-Logged Payment', false, 500, {}, errorMessage.internalServer, err.message);
    }
  }


export const getSinglePayment = async (req, res) => {
    try {
        const data = await Payment.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Payment', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Payment', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createPayment = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: PaymentDocument = req.body;
            const createData = new Payment(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Payment', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Payment', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Payment', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};




export const updatePayment = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const demoDetails: PaymentDocument = req.body;
            let statusData = await Payment.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                  
                    modifiedOn: new Date(),
                    modifiedBy:  demoDetails.modifiedBy,
                },
                $addToSet: {
            
               }
            });

            response(req, res, activity, 'Level-1', 'Update-Payment Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Payment Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Payment Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deletePayment = async (req, res, next) => {

        try {
            let id = req.query._id;
            const demo = await Payment.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Payment', true, 200, demo, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Payment', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



export let getFilteredPayment = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.name) {
                andList.push({ name: req.body.name })
            }
            if (req.body.code) {
                andList.push({ code: req.body.code })
            }  
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await Payment.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await Payment.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Payment', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Payment', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let createPaymentIntent = async (req, res) => {
        const { amount, currency, studentId } = req.body;
    
        try {
           
            const paymentIntent = await stripe.paymentIntents.create({
             
                amount: amount, // Convert amount to smallest currency unit
                currency: currency || 'usd',
            });
    
            // Save the payment details in your database
            const payment = new Payment({
                studentId: studentId,
                amount,
                currency: currency || 'usd',
                stripePaymentId: paymentIntent.id,
                status: 'Pending',
            });
    
            await payment.save();
    
            res.status(200).json({clientSecret: paymentIntent.client_secret, details:payment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    



export const checkOut = async (req, res) => {
    const { amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Application Fees',
                        },
                        unit_amount: amount, // Amount should be in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://crm.edufynd.in/list_application',
            cancel_url: 'https://crm.edufynd.in/view_application',
        });

         res.json({ id: session.id });
 
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        res.status(500).json({ error: error.message });
    }
};

    