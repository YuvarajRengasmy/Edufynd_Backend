import { saveLog } from "../controller/logs.controller";
import { LogsDocument, Logs } from "../model/logs.model";
import * as config from '../config';
var nodemailer = require('nodemailer');


/**

 * @param success {Boolean} Http Status Code for the response
 * @param result {Object/Array} Result for the Response
 * @param message {string} Primary message for the response
 * @param extendedMessage {Object} Detailed Message for the error Message
 * @function commonResponse {Function} Used for Handling the Common Response
 */

export let response = function (req, res, activity, level, method, success, statusCode, result, message, extendedMessage?) {
    const LogsData: LogsDocument = new Logs();
    let date = new Date()
    LogsData.activity = activity;
    var trusted_proxies = ['177.144.11.100', '177.144.11.101'];
    LogsData.userId = (req.body.loginId) ? req.body.loginId : '';
    LogsData.url = req.baseurl;
    LogsData.time = date.getTime();
    LogsData.date = date;
    LogsData.level = level;
    LogsData.description = message;
    LogsData.method = method;
    LogsData.processStatus = (statusCode === 200) ? true : false;
    saveLog(LogsData);
    res.status(statusCode);
    return res.json({
        success: success,
        result: result || '',
        message: message || '',
        extendedMessage: extendedMessage || '',
        statusCode: statusCode
    });
}



export const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service
    host: config.SERVER.EMAIL_HOST,
    secure: true,
    port:  config.SERVER.EMAIL_PORT,
    auth: {
        user: config.SERVER.EMAIL_USER,
        pass: config.SERVER.EMAIL_PASS
    },
   
});




// Convert the EMAIL_PORT to a number before comparison
// const emailPort = parseInt(config.SERVER.EMAIL_PORT, 10);

// if (isNaN(emailPort)) {
//     throw new Error('EMAIL_PORT is not a valid number');
// }

// export const transporter  = nodemailer.createTransport({
//     host: config.SERVER.EMAIL_HOST,
//     port: emailPort,
//     secure: emailPort === 465,// true for port 465, false for other ports
//     auth: {
//         user: config.SERVER.EMAIL_USER,
//         pass: config.SERVER.EMAIL_PASS
//     },
//     // tls: {
//     //     rejectUnauthorized: false // Allow self-signed certificates
//     // },
//     // greetingTimeout: 20000, // 20 seconds
//     // connectionTimeout: 30000, // 30 seconds
//     // socketTimeout: 30000 // 30 seconds
// });


export const sendEmail = async (req, toMail, subject?: any, text?: any) => {
    var sender = nodemailer.createTransport({
        service: 'edufynd.in',
        port:  config.SERVER.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: config.SERVER.EMAIL_USER, 
            pass:  config.SERVER.EMAIL_PASS
        }
    });

    var composemail = {
        from: config.SERVER.EMAIL_USER, 
        to: toMail,
        subject: subject,
        text: text
    }

    await sender.sendMail(composemail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Mail send successfully' + info.response)
        }
    })
}

