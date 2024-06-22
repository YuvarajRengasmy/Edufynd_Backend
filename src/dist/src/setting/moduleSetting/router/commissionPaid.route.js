"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commissionPaid_controller_1 = require("../../moduleSetting/controller/commissionPaid.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, commissionPaid_controller_1.getAllCommissionPaid);
router.get('/getSingleCommissionPaid', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), commissionPaid_controller_1.getSingleCommissionPaid);
router.post('/', checkAuth_1.basicAuthUser, commissionPaid_controller_1.createCommissionPaid);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), commissionPaid_controller_1.updateCommissionPaid);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), commissionPaid_controller_1.deleteCommissionPaid);
router.put('/getFilterCommissionPaid', checkAuth_1.basicAuthUser, commissionPaid_controller_1.getFilteredCommissionPaid);
exports.default = router;
//# sourceMappingURL=commissionPaid.route.js.map