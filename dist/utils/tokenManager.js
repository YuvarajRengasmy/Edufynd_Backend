"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSession = exports.CreateJWTToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
const activity = 'token';
/**
 * @author Balan K K
 * @date 01-05-2024
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to token creation
 */
let CreateJWTToken = (data = {}) => {
    let tokenData = {};
    if (data && data['name']) {
        tokenData['name'] = data['name'];
    }
    if (data && data['loginType']) {
        tokenData['loginType'] = data['loginType'];
    }
    if (data && data['id']) {
        tokenData['id'] = data['id'];
    }
    const token = jwt.sign(tokenData, 'masterin', { expiresIn: '24h' });
    return token;
};
exports.CreateJWTToken = CreateJWTToken;
/**
 * @author Ponjothi S
 * @date 07-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to Chech the session and Verify the token
 */
let checkSession = async (req, res, next) => {
    const token = req.headers['token'];
    if (token) {
        const headerType = token.split(' ')[0];
        const tokenValue = token.split(' ')[1].trim();
        if (headerType.trim() === "Bearer") {
            try {
                jwt.verify(tokenValue, 'masterin', function (err, tokendata) {
                    if (err) {
                        return res.status(400).json({ message: ErrorMessage_1.clientError.token.sessionExpire });
                    }
                    if (tokendata) {
                        console.log('tokendata', tokendata);
                        req.body.loginId = tokendata.userId;
                        req.body.loginUserName = tokendata.userName;
                        req.body.createdBy = tokendata.userName;
                        req.body.createdOn = new Date();
                        req.body.modifiedBy = tokendata.userName;
                        req.body.modifiedOn = new Date();
                        next();
                    }
                });
            }
            catch (err) {
                return (0, commonResponseHandler_1.response)(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, ErrorMessage_1.clientError.token.unauthRoute, err.message);
            }
        }
    }
    else {
        return (0, commonResponseHandler_1.response)(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, ErrorMessage_1.clientError.token.unauthRoute);
    }
};
exports.checkSession = checkSession;
