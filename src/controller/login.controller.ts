import { validationResult } from "express-validator";
import { decrypt, encrypt } from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail, transporter } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { SuperAdmin } from "../model/superAdmin.model";
import { Admin } from "../model/admin.model";
import { Student } from "../model/student.model";
import { Agent } from "../model/agent.model";
import { v4 as uuidv4 } from 'uuid'
import * as config from '../config';




var activity = "Login"

/**
 * @author Balan K K
 * @date 01-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to Login.
 */
export let loginEmail = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let { email, password } = req.body;

            const student = await Student.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 })
            const superAdmin = await SuperAdmin.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 })
            const admin = await Admin.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 })
            const agent = await Agent.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 })


            if (student) {
                const newHash = await decrypt(student["password"]);

                if (student["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: student["_id"],
                        name: student["name"],
                        loginType: 'student'
                    });
                    const details = {}
                    details['_id'] = student._id
                    details['email'] = student.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'student';
                    finalResult["studentDetails"] = details;
                    finalResult["token"] = token;
                    // response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, "Student Login Successfully");
                }
            }
            else if (agent) {
                const newHash = await decrypt(agent["password"]);
                if (agent["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: agent["_id"],
                        name: agent["name"],
                        loginType: 'agent'
                    });
                    const details = {}
                    details['_id'] = agent._id
                    details['email'] = agent.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'agent';
                    finalResult["agentDetails"] = details;
                    finalResult["token"] = token;
                    // response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, "Agent Login Successfully");
                }
            }
            else if (superAdmin) {
                const newHash = await decrypt(superAdmin["password"]);
                if (superAdmin["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: superAdmin["_id"],
                        name: superAdmin["name"],
                        loginType: 'superAdmin'
                    });
                    const details = {}
                    details['_id'] = superAdmin._id
                    details['email'] = superAdmin.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'superAdmin';
                    finalResult["superAdminDetails"] = details;
                    finalResult["token"] = token;
                    // response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, "Super Admin Login Successfully");
                }
            } else if (admin) {
                const newHash = await decrypt(admin["password"]);
                if (admin["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: admin["_id"],
                        name: admin["name"],
                        loginType: 'admin'
                    });
                    const details = {}
                    details['_id'] = admin._id
                    details['email'] = admin.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'admin';
                    finalResult["adminDetails"] = details;
                    finalResult["token"] = token;
                    // response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, "Admin Login Successfully");
                }
            }
            else {
                response(req, res, activity, 'Level-3', 'Login-Email', true, 422, {}, 'Invalid Email Id');
            }
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Login-Email', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
        }
    }
};


export const forgotPassword = async (req, res) => {
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
    try {
        const { email } = req.body;
        const student = await Student.findOne({ email });
        const admin = await Admin.findOne({ email })
        const agent = await Agent.findOne({ email })

        if (student) {
            const otp = uuidv4().slice(0, 6); // Generate a 6-character OTP
            student.resetOtp = otp;
            student.resetOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour

            await student.save();
            const mailOptions = {
                from: config.SERVER.EMAIL_USER,
                to: student.email,
                subject: 'Password Reset Request',
                text: `Hello ${student.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 1 hour.\n\n Best regards\nAfynd Private Limited\nChennai.`
            };
            transporter.sendMail(mailOptions, (error, info: any) => {

                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: 'OTP sent to email' });
                }
            });

        } else if (admin) {
            const otp = uuidv4().slice(0, 6); // Generate a 6-character OTP
            admin.resetOtp = otp;
            admin.resetOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour

            await admin.save();
            const mailOptions = {
                from: config.SERVER.EMAIL_USER,
                to: admin.email,
                subject: 'Password Reset Request',
                text: `Hello ${admin.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 1 hour.\n\nThank you!`
            };
            transporter.sendMail(mailOptions, (error, info: any) => {

                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: 'OTP sent to email' });
                }
            });

        } else if (agent) {
            const otp = uuidv4().slice(0, 6); // Generate a 6-character OTP
            agent.resetOtp = otp;
            agent.resetOtpExpires = Date.now() + 3600000; // OTP expires in 1 hour

            await agent.save();
            const mailOptions = {
                from: config.SERVER.EMAIL_USER,
                to: agent.email,
                subject: 'Password Reset Request',
                text: `Hello ${agent.agentName},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 1 hour.\n\nThank you!`
            };
            transporter.sendMail(mailOptions, (error, info: any) => {

                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: 'OTP sent to email' });
                }
            });

        } else {
            response(req, res, activity, 'Level-3', 'ForgotPassword', true, 422, {}, 'Invalid Email Id');
        }
    } catch (error) {
        console.error('Error requesting password reset:', error);
        response(req, res, activity, 'Level-3', 'ForgotPassword', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(error.mapped()));
    }
}
}




export let resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let student = await Student.findById({ _id: req.body._id })
            let admin = await Admin.findById({ _id: req.body._id })
            let agent = await Agent.findById({ _id: req.body._id })

            let { modifiedOn, modifiedBy } = req.body
            let id = req.body._id
            req.body.password = await encrypt(req.body.password);
            if (student) {
                const data = await Student.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }
            else if (admin) {
                const data = await Admin.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }
            else {
                const data = await Agent.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Password', true, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Password', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}