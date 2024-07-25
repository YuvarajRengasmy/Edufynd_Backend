"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loanEnquiry_controller_1 = require("../controller/loanEnquiry.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
loanEnquiry_controller_1.getAllLoanEnquiry);
router.get('/getSingleLoanEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), loanEnquiry_controller_1.getSingleLoanEnquiry);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), loanEnquiry_controller_1.createLoanEnquiry);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), loanEnquiry_controller_1.updateLoanEnquiry);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), loanEnquiry_controller_1.deleteLoanEnquiry);
router.put('/getFilterLoanEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
loanEnquiry_controller_1.getFilteredLoanEnquiry);
exports.default = router;
//# sourceMappingURL=loanEnquiry.route.js.map