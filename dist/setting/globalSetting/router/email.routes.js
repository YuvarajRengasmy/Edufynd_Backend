"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = require("../../globalSetting/controller/email.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/getAllCountry', //get all Email Template
checkAuth_1.basicAuthUser, email_controller_1.getAllEmailTemplate);
router.get('/getSingleCountry', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), email_controller_1.getSingleTemplate);
router.post('/', checkAuth_1.basicAuthUser, email_controller_1.createEmailTemplate);
router.put('/', // update Template
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), email_controller_1.updateTemplate);
router.delete('/', //delete Template
checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), email_controller_1.deleteTemplate);
router.put('/getFilterEmail', checkAuth_1.basicAuthUser, email_controller_1.getFilteredEmail);
exports.default = router;
