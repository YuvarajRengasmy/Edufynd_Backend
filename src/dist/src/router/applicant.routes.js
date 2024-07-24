"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicant_controller_1 = require("../controller/applicant.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, applicant_controller_1.getAllApplicant);
router.get('/getSingleApplicant', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), applicant_controller_1.getSingleApplicant);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, applicant_controller_1.createApplicant);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), 
// checkRequestBodyParams('_id'),
applicant_controller_1.updateApplicant);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), applicant_controller_1.deleteApplicant);
router.put('/getFilterApplicant', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, applicant_controller_1.getFilteredApplication);
exports.default = router;
//# sourceMappingURL=applicant.routes.js.map