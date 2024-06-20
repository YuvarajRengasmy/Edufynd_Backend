"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = void 0;
const user_model_1 = require("../model/user.model");
const commonResponseHandler_1 = require("../helper/commonResponseHandler");
const ErrorMessage_1 = require("../helper/ErrorMessage");
var activity = "User";
const getAllUser = async (req, res, next) => {
    try {
        const user = await user_model_1.User.find({ isDeleted: false });
        (0, commonResponseHandler_1.response)(req, res, activity, "Level-1", "GetAll-User", true, 200, user, ErrorMessage_1.clientError.success.fetchedSuccessfully);
    }
    catch (err) {
        (0, commonResponseHandler_1.response)(req, res, activity, "Level-1", 'GetAll-User', false, 500, {}, ErrorMessage_1.errorMessage.internalServer, err.message);
    }
};
exports.getAllUser = getAllUser;
