"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = exports.response = void 0;
const logs_controller_1 = require("../controller/logs.controller");
const logs_model_1 = require("../model/logs.model");
var nodemailer = require('nodemailer');
/**

 * @param success {Boolean} Http Status Code for the response
 * @param result {Object/Array} Result for the Response
 * @param message {string} Primary message for the response
 * @param extendedMessage {Object} Detailed Message for the error Message
 * @function commonResponse {Function} Used for Handling the Common Response
 */
let response = function (req, res, activity, level, method, success, statusCode, result, message, extendedMessage) {
    const LogsData = new logs_model_1.Logs();
    let date = new Date();
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
    (0, logs_controller_1.saveLog)(LogsData);
    res.status(statusCode);
    return res.json({
        success: success,
        result: result || '',
        message: message || '',
        extendedMessage: extendedMessage || '',
        statusCode: statusCode
    });
};
exports.response = response;
exports.transporter = nodemailer.createTransport({
    service: 'Gmail',
    // host: 'smtp.gmail.com',
    // secure: false,
    // port: 587,
    auth: {
        user: 'balan9133civil@gmail.com',
        pass: 'ewlm tlbx tqjj svrg'
    }
});
const sendEmail = async (req, toMail, subject, text) => {
    var sender = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'balan9133civil@gmail.com',
            pass: 'goqc wrqi hsqy vcoy'
        }
    });
    var composemail = {
        from: 'balan9133civil@gmail.com',
        to: toMail,
        subject: subject,
        text: text
    };
    await sender.sendMail(composemail, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Mail send successfully' + info.response);
        }
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=commonResponseHandler.js.map