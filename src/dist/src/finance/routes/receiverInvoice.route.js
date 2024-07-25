"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const receiverInvoice_controller_1 = require("../controller/receiverInvoice.controller");
const Validators_1 = require("../../middleware/Validators");
const checkAuth_1 = require("../../middleware/checkAuth");
const tokenManager_1 = require("../../utils/tokenManager");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, receiverInvoice_controller_1.getAllReceiverInvoice);
router.get('/getSingleReceiverInvoice', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), receiverInvoice_controller_1.getSingleReceiverInvoice);
router.post('/', receiverInvoice_controller_1.createReceiverInvoice);
router.put('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), receiverInvoice_controller_1.updateReceiverInvoice);
router.delete('/', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), receiverInvoice_controller_1.deleteReceiverInvoice);
router.put('/getFilterSenderInvoice', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, receiverInvoice_controller_1.getFilteredReceiverInvoice);
exports.default = router;
//# sourceMappingURL=receiverInvoice.route.js.map