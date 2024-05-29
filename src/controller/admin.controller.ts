import { Admin, AdminDocument } from '../model/admin.model'
import { validationResult } from "express-validator";
import * as TokenManager from "../utils/tokenManager";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { decrypt, encrypt } from "../helper/Encryption";

var activity = "Admin";



export let getAllAdmin = async (req, res, next) => {
    try {
        const data = await Admin.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Admin', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleAdmin = async (req, res, next) => {
    try {
        const agent = await Admin.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Admin', true, 200, agent, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Admin', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let createAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await Admin.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const adminDetails: AdminDocument = req.body;
                const uniqueId = Math.floor(Math.random() * 1000)
                adminDetails.adminCode = "AD" + uniqueId + "Fynd"
             
                const createData = new Admin(adminDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'admin'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'admin';
                finalResult["adminDetails"] = result;

                response(req, res, activity, 'Level-2', 'Create-Admin', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Admin', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}