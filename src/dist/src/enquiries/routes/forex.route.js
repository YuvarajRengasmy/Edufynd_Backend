"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forex_controller_1 = require("../controller/forex.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, 
//  checkSession,
forex_controller_1.getAllForexEnquiry);
router.get('/getSingleForexEnquiry', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), forex_controller_1.getSingleForexEnquiry);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), forex_controller_1.createForexEnquiry);
router.put('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkRequestBodyParams)('_id'), forex_controller_1.updateForexEnquiry);
router.delete('/', checkAuth_1.basicAuthUser, 
// checkSession,
(0, Validators_1.checkQuery)('_id'), forex_controller_1.deleteForexEnquiry);
router.put('/getFilterForex', checkAuth_1.basicAuthUser, 
// checkSession,
forex_controller_1.getFilteredForexEnquiry);
exports.default = router;
//# sourceMappingURL=forex.route.js.map