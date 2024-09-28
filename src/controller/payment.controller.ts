import { Payment, PaymentDocument } from '../model/payment.model'
import { Logs } from "../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
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

