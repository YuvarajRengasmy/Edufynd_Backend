"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const senderInvoice_controller_1 = require("../controller/senderInvoice.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const tokenManager_1 = require("../../utils/tokenManager");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, senderInvoice_controller_1.getAllSenderInvoice);
router.get('/getSingleSenderInvoice', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), senderInvoice_controller_1.getSingleSenderInvoice);
router.post('/', senderInvoice_controller_1.createSenderInvoice);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), senderInvoice_controller_1.updateSenderInvoice);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), senderInvoice_controller_1.deleteSenderInvoice);
router.put('/getFilterSenderInvoice', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, senderInvoice_controller_1.getFilteredSenderInvoice);
exports.default = router;
//# sourceMappingURL=senderInvoice.route.js.map