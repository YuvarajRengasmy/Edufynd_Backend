"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequestBodyParams = exports.checkParam = exports.checkQuery = void 0;
const { check, param, query } = require('express-validator');
const ErrorMessage_1 = require("../helper/ErrorMessage");
const express_validator_1 = require("express-validator");
/**
 * @author Balan K K
 * @date  01-05-2024
 * @description Function to check for the Validation of Query
 * @param {string} id
 * @param {boolean} isRequired
 */
let checkQuery = (id) => {
    return query(id, ErrorMessage_1.ErrorMessage.id.required).isLength({ min: 1 }).trim().exists();
};
exports.checkQuery = checkQuery;
/**
 * @author Balan K K
 * @date  01-05-2024
 * @description Function to check for the Validation of Params
 * @param {string} id
 * @param {boolean} isRequired
 */
let checkParam = (id) => {
    return param(id, ErrorMessage_1.ErrorMessage.id.required).trim().exists();
};
exports.checkParam = checkParam;
/**
 * @author Balan K K
 * @date  01-05-2024
 * @description Function to check for the Validation of boady arguments
 * @param {string} val
 * @param {boolean} isRequired
 */
let checkRequestBodyParams = (val) => {
    return (0, express_validator_1.body)(val, ErrorMessage_1.ErrorMessage.general.required).isLength({ min: 1 }).trim().exists().withMessage(ErrorMessage_1.ErrorMessage.general.required);
};
exports.checkRequestBodyParams = checkRequestBodyParams;
