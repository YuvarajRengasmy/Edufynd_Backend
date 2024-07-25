"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalEnquiry_controller_1 = require("../controller/generalEnquiry.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
generalEnquiry_controller_1.getAllGeneralEnquiry);
router.get('/getSingleGeneralEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), generalEnquiry_controller_1.getSingleGeneralEnquiry);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), generalEnquiry_controller_1.createGeneralEnquiry);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), generalEnquiry_controller_1.updateGeneralEnquiry);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), generalEnquiry_controller_1.deleteGeneralEnquiry);
router.put('/getFilterGeneralEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
generalEnquiry_controller_1.getFilteredGeneralEnquiry);
exports.default = router;
//# sourceMappingURL=generalEnquiry.route.js.map