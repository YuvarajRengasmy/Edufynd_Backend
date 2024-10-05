import { Payment, PaymentDocument } from '../model/payment.model'
import { Logs } from "../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import * as crypto from "crypto";
import { Cashfree } from 'cashfree-pg';
import * as config from '../config';
var activity = "Payment";



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

        res.status(200).json({ clientSecret: paymentIntent.client_secret, details: payment });
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



Cashfree.XClientId = config.SERVER.CASHFREE_CLIENT_ID
Cashfree.XClientSecret = config.SERVER.CASHFREE_SECRET_KEY
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX



const generateOrderId = ()=>{

    const uniqueId = crypto.randomBytes(16).toString('hex')
    const hash = crypto.createHash('sha256')
        hash.update(uniqueId)
    
    const orderId = hash.digest('hex')

    return orderId.substring(0,12)
}


export const cashFreePayment = async (req, res) => {
    try {
        // const { customer_details, order_amount, order_currency } = req.body;

        const paymentDetails: PaymentDocument = req.body;
        const order_id = await generateOrderId();

        // Constructing the request object
        const paymentData = {
            "order_amount": paymentDetails.order_amount,
            "order_currency": paymentDetails.order_currency,
            "order_id": order_id,
            "customer_details": {
                "customer_id": paymentDetails.customer_details.customer_id,
                "customer_phone": paymentDetails.customer_details.customer_phone,
                "customer_name": paymentDetails.customer_details.customer_name,
                "customer_email": paymentDetails.customer_details.customer_email
            }
        };

        // Save the initial payment details to the MongoDB Payment collection
        let newPayment = new Payment(paymentData);
        await newPayment.save();

        // Making the API call to Cashfree's PGCreateOrder
        const cashfreeResponse = await Cashfree.PGCreateOrder("2022-09-01", paymentData);

        newPayment.cashfree_response = cashfreeResponse.data;             // Store the entire response (if needed)
    
        // Save the updated payment details to the MongoDB Payment collection
        await newPayment.save();

        // Respond with the data from Cashfree
        res.json(cashfreeResponse.data);

    } catch (err) {
        // Logging and sending back the error message
        console.error('Error creating Cashfree order:', err);

        if (err.response) {
            // If the error comes with a response from the API (e.g., status code 400)
            res.status(err.response.status).json({
                message: 'Failed to create Cashfree order',
                error: err.response.data  // Detailed error message from Cashfree
            });
        } else {
            // For other errors, return a generic error message
            res.status(500).json({
                message: 'Internal server error',
                error: err.message
            });
        }
    }
};



