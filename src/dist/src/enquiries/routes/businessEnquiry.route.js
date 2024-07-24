"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessEnquiry_controller_1 = require("../controller/businessEnquiry.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
businessEnquiry_controller_1.getAllBusinessEnquiry);
router.get('/getSingleBusinessEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), businessEnquiry_controller_1.getSingleBusinessEnquiry);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), businessEnquiry_controller_1.createBusinessEnquiry);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), businessEnquiry_controller_1.updateBusinessEnquiry);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), businessEnquiry_controller_1.deleteBusinessEnquiry);
router.put('/getFilterBusinessEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
businessEnquiry_controller_1.getFilteredBusinessEnquiry);
exports.default = router;
//# sourceMappingURL=businessEnquiry.route.js.map