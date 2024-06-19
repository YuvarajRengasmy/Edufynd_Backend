import { validationResult } from "express-validator";
import { decrypt, encrypt } from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { SuperAdmin } from "../model/superAdmin.model";
import { Admin } from "../model/admin.model";
import { Student } from "../model/student.model";
import { Agent } from "../model/agent.model";




var activity = "Login"

/**
 * @author Ponjothi S
 * @date 14-11-2023
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

            const student = await Student.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1,name:1, status: 1 })
            const superAdmin = await SuperAdmin.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1,name:1, status: 1 })
            const admin = await Admin.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1,name:1, status: 1 })
            const agent = await Agent.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1,name:1, status: 1 })
            
            
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
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
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
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
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
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                }
            }else if (admin) {
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
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
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

