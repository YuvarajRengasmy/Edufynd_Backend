// import { saveLog } from "../controller/logs.controller";
import { logChanges } from "../controller/logs.controller";
import { LogsDocument, Logs } from "../model/logs.model";
import * as config from '../config';
var nodemailer = require('nodemailer');



export const transporter = nodemailer.createTransport({
    // service: 'Gmail', // You can use any email service
    service: 'edufynd.in',
    host: config.SERVER.EMAIL_HOST,
    secure: true,
    port:  config.SERVER.EMAIL_PORT,
    auth: {
        user: config.SERVER.EMAIL_USER,
        pass: config.SERVER.EMAIL_PASS
    },
   
});


export const sendEmail = async (req:any, toMail:any, subject?: any, text?: any) => {
    var sender = nodemailer.createTransport({
        // service: 'Gmail',
        service: 'edufynd.in',
        port: config.SERVER.EMAIL_PORT,
        host: config.SERVER.EMAIL_HOST,
        secure: true, // true for 465, false for other ports
        auth: {
            user: config.SERVER.EMAIL_USER,
            pass: config.SERVER.EMAIL_PASS
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



// export let response = function (req, res, activity, level, method, success, statusCode, result, message, extendedMessage?) {
//     const LogsData: LogsDocument = new Logs();
//     let date = new Date()
//     LogsData.activity = activity;
//     var trusted_proxies = ['103.174.102.182',];
//     LogsData.userId = (req.body.loginId) ? req.body.loginId : '';
//     LogsData.url = req.baseurl;
//     LogsData.time = date.getTime();
//     LogsData.date = date;
//     LogsData.level = level;
//     LogsData.description = message;
//     LogsData.method = method;
//     LogsData.processStatus = (statusCode === 200) ? true : false;
//     saveLog(LogsData);
//     res.status(statusCode);
//     return res.json({
//         success: success,
//         result: result || '',
//         message: message || '',
//         extendedMessage: extendedMessage || '',
//         statusCode: statusCode
//     });
// }


//log-2
export let response = function (req, res, activity, level, method, success, statusCode, result, message, extendedMessage?) {
    const LogsData: LogsDocument = new Logs();

    const date = new Date();

    LogsData.activity = activity;
    LogsData.userType = req.body.loginId || '';
    LogsData.userId = (req.body.loginId) ? req.body.loginId : '';
    LogsData.url = req.originalUrl;
    LogsData.time = date.getTime();
    LogsData.date = date;
    LogsData.level = level;
    LogsData.description = message;
    LogsData.method = method;
    LogsData.processStatus = statusCode === 200;

    // logChanges(LogsData); // Save the log

    res.status(statusCode).json({
        success: success,
        result: result || '',
        message: message || '',
        extendedMessage: extendedMessage || '',
        statusCode: statusCode
    });
};


export const LoggingMiddleware = async (schema) => {
    // Middleware for update operation
    schema.pre('findOneAndUpdate', async function (next) {
        const modelName = this.model.modelName;
        const docToUpdate = await this.model.findOne(this.getQuery()).lean();
        if (docToUpdate) {
            const updates = this.getUpdate();
            await logChanges(docToUpdate, 'update', updates, modelName);
        }
        next();
    });

    // Middleware for delete operation
    schema.pre('findOneAndDelete',  async function (next) {
        const modelName = this.model.modelName;
        const docToDelete = await this.model.findOne(this.getQuery()).lean();
        if (docToDelete) {
            await logChanges(docToDelete, 'delete', null, modelName);
        }
        next();
    })
}
