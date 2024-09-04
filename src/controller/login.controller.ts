import { validationResult } from "express-validator";
import { decrypt, encrypt } from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail, transporter } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { SuperAdmin } from "../model/superAdmin.model";
import { Admin } from "../model/admin.model";
import { Student } from "../model/student.model";
import { Agent } from "../model/agent.model";
import { Staff } from '../model/staff.model'
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
            const staff = await Staff.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1, name: 1, status: 1 })

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
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, "Admin Login Successfully");
                }
            } else if (staff) {
                const newHash = await decrypt(staff["password"]);
                if (staff["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: staff["_id"],
                        empName: staff["empName"],
                        loginType: 'staff'
                    });
                 
                    const details = {}
                    details['_id'] = staff._id
                    details['email'] = staff.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'staff';
                    finalResult["staffDetails"] = details;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, "Staff Login Successfully");
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



export let forgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(req, res, activity, 'Level-3', 'Forgot-Password', false, 422, {}, errors.array());
    }
    try {
        const { recoveryEmail, email, link } = req.body;

        let user: any;
        if (recoveryEmail) {
            user = await SuperAdmin.findOne({ recoveryEmail });
        } else if (email) {
            user = await SuperAdmin.findOne({ email, isDeleted: false }) ||
                await Admin.findOne({ email, isDeleted: false }) ||
                await Student.findOne({ email, isDeleted: false }) ||
                await Agent.findOne({ email, isDeleted: false }) ||
                await Staff.findOne({ email, isDeleted: false });
        }
        if (user) {
            const _id = user._id;
            try {
                const doc = await sendEmail(req, email || recoveryEmail, 'Reset Password', `${link}${_id}`);
                response(req, res, "forgotPassword", 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend);
            } catch (error) {
                console.error(error);
                response(req, res, "forgotPassword", 'Level-3', 'Forgot-Password', false, 500, {}, errorMessage.internalServer, error.message);
            }
        } else {
            response(req, res, "forgotPassword", 'Level-3', 'Forgot-Password', false, 422, {}, clientError.user.userDontExist);
        }
    } catch (err) {
        console.error(err);
        response(req, res, "forgotPassword", 'Level-3', 'Forgot-Password', false, 500, {}, errorMessage.internalServer, err.message);
    }
};




export let resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let student = await Student.findById({ _id: req.body._id })
            let admin = await Admin.findById({ _id: req.body._id })
            let agent = await Agent.findById({ _id: req.body._id })
            let staff = await Staff.findById({ _id: req.body._id })

            let { modifiedOn, modifiedBy } = req.body
            let id = req.body._id
            req.body.password = await encrypt(req.body.password);
            req.body.confirmPassword = await encrypt(req.body.confirmPassword)

            if (student) {
                const data = await Student.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword,
                        modifiedOn: new Date(),
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, "Reset-Password", 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }
            else if (admin) {
                const data = await Admin.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword,
                        modifiedOn: new Date(),
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, "Reset-Password", 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }
            else if (staff) {
                const data = await Staff.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword,
                        modifiedOn: new Date(),
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, "Reset-Password", 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }
            else  {
                const data = await Agent.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword,
                        modifiedOn: new Date(),
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, "Reset-Password", 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }

        } catch (err: any) {
            response(req, res, "Reset-Password", 'Level-3', 'Update-Password', true, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, "Reset-Password", 'Level-3', 'Update-Password', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}




