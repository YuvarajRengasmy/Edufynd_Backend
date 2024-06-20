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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.hashPassword = void 0;
const crypto = __importStar(require("crypto"));
const Config = __importStar(require("../config/Enviornment"));
const crypto_js_1 = __importDefault(require("crypto-js"));
let password = "1234";
let conversionOutput;
/**
 * @author Balan K K
 * @date  01-05-2024
 * @description This function return password encryption.
 * @param {String} text
 */
let hashPassword = async (text) => {
    console.log(text);
    return await new Promise((resolve, reject) => {
        const hash = crypto.createHmac("sha256", Config.SERVER.SALT);
        hash.update(text.toString());
        resolve(hash.digest("hex"));
    });
};
exports.hashPassword = hashPassword;
/**
 * @author Balan K K
 * @date  01-05-2024
 * @description This function return decrypted item for given encryption using cryptojs
 * @param {String} encrypted
 */
let encrypt = (textToConvert) => {
    return (conversionOutput = crypto_js_1.default.AES.encrypt(textToConvert.trim(), password.trim()).toString());
};
exports.encrypt = encrypt;
/**
 * @author Balan K K
 * @date  01-05-2024
 * @description This function return encrypted item for given string using cryptojs
 * @param {String} text
 */
let decrypt = (textToConvert) => {
    return (conversionOutput = crypto_js_1.default.AES.decrypt(textToConvert.trim(), password.trim()).toString(crypto_js_1.default.enc.Utf8));
};
exports.decrypt = decrypt;
